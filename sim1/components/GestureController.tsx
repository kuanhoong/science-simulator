import React, { useEffect, useRef, useState } from 'react';
import { GESTURE_EVENT_NAME, GestureEventDetail, GestureState } from '../types';

export const GestureController: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<string>('Initializing Hand Tracking...');
  const [currentGesture, setCurrentGesture] = useState<string>('None');
  
  // State for gesture analysis logic
  const logicRef = useRef<GestureState>({
    lastZoomGesture: 'none',
    zoomFrames: 0
  });

  const config = {
    minStableFrames: 4
  };

  useEffect(() => {
    let hands: any;
    let camera: any;

    const onResults = (results: any) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        analyzeGestures(landmarks);
      } else {
        setCurrentGesture('None');
        setStatus('Show hand to control');
        logicRef.current.lastZoomGesture = 'none';
        logicRef.current.zoomFrames = 0;
      }
    };

    const analyzeGestures = (landmarks: any[]) => {
      const state = logicRef.current;
      
      // Finger Extension Check
      const fingerPairs = [
        { tip: 8, pip: 6 },   // Index
        { tip: 12, pip: 10 }, // Middle
        { tip: 16, pip: 14 }, // Ring
        { tip: 20, pip: 18 }  // Pinky
      ];

      let extendedCount = 0;
      fingerPairs.forEach(({ tip, pip }) => {
        // Y coordinates are normalized [0,1], 0 is top.
        // Finger extended upwards means tip.y < pip.y
        if (landmarks[tip].y < landmarks[pip].y - 0.02) {
          extendedCount++;
        }
      });

      // --- ZOOM GESTURE ---
      let detectedZoom: 'open' | 'closed' | 'none' = 'none';
      if (extendedCount >= 3) {
        detectedZoom = 'open';
      } else if (extendedCount <= 1) {
        detectedZoom = 'closed';
      }

      if (detectedZoom !== 'none') {
        if (detectedZoom === state.lastZoomGesture) {
          state.zoomFrames++;
        } else {
          state.lastZoomGesture = detectedZoom;
          state.zoomFrames = 1;
        }

        if (state.zoomFrames >= config.minStableFrames) {
          const type = detectedZoom === 'open' ? 'zoom-in' : 'zoom-out';
          emitGesture(type);
          setCurrentGesture(detectedZoom === 'open' ? 'Zooming In (Palm Open)' : 'Zooming Out (Fist)');
        }
      } else {
        state.lastZoomGesture = 'none';
        state.zoomFrames = 0;
        setCurrentGesture('None');
      }
    };

    const emitGesture = (type: string, strength: number = 1) => {
      const event = new CustomEvent<GestureEventDetail>(GESTURE_EVENT_NAME, {
        detail: { type: type as any, strength }
      });
      window.dispatchEvent(event);
    };

    const init = async () => {
      if (typeof window.Hands === 'undefined') {
        setStatus('Failed to load MediaPipe Hands.');
        return;
      }

      hands = new window.Hands({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.5,
        selfieMode: true 
      });

      hands.onResults(onResults);

      if (videoRef.current) {
        camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) {
              await hands.send({ image: videoRef.current });
            }
          },
          width: 320,
          height: 240
        });
        
        try {
          await camera.start();
          setStatus('Active');
        } catch (err) {
          console.error(err);
          setStatus('Camera Error (HTTPS required?)');
        }
      }
    };

    init();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className="absolute bottom-4 right-4 w-64 bg-black/80 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-2xl z-50">
      <div className="relative aspect-video rounded-lg overflow-hidden bg-black mb-2 ring-1 ring-white/20">
        <video 
          ref={videoRef} 
          className="w-full h-full object-cover opacity-80"
          playsInline 
          muted
        />
        <div className="absolute top-2 left-2 text-[10px] uppercase tracking-wider font-bold text-green-400 bg-black/60 px-1.5 py-0.5 rounded">
          {status}
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400 font-medium">Gesture</span>
          <span className={`text-xs font-bold ${currentGesture === 'None' ? 'text-gray-500' : 'text-blue-400'}`}>
            {currentGesture}
          </span>
        </div>
        
        <div className="h-px bg-white/10 my-2"></div>
        
        <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500 leading-tight">
          <div>
            <span className="text-gray-300 block">Zoom In</span>
            Open Palm
          </div>
          <div>
            <span className="text-gray-300 block">Zoom Out</span>
            Closed Fist
          </div>
        </div>
      </div>
    </div>
  );
};