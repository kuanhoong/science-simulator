
import React, { useEffect, useRef, useState } from 'react';
import { SceneManager } from './render/SceneManager';
import { AudioEngine } from './audio/AudioEngine';
import ControlsPanel from './components/ControlsPanel';
import AudioHUD from './components/AudioHUD';
import { AppState, ParticleShape, ColorMode, AudioState } from './types';

const INITIAL_STATE: AppState = {
  particleCount: 20000,
  particleSize: 1.5,
  shape: ParticleShape.CIRCLE,
  colorMode: ColorMode.GRADIENT,
  primaryColor: '#00ffff',
  secondaryColor: '#ff00ff',
  loudnessSensitivity: 1.0,
  pitchInfluence: 1.0,
  micEnabled: false,
  isDemoMode: true
};

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneManager = useRef<SceneManager | null>(null);
  const audioEngine = useRef<AudioEngine>(new AudioEngine());
  
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  // Use a ref to store the state so the animation loop always has access to the latest values
  const stateRef = useRef<AppState>(state);
  
  const [audioState, setAudioState] = useState<AudioState>({
    loudnessNorm: 0,
    pitchNorm: 0,
    pitchHz: 0,
    confidence: 0
  });

  // Update stateRef whenever state changes
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js with initial state
    sceneManager.current = new SceneManager(containerRef.current, stateRef.current);

    // Animation Loop
    let animationFrameId: number;
    const render = () => {
      const audio = audioEngine.current.update();
      setAudioState(audio);
      
      if (sceneManager.current) {
        // Pass the latest state from the ref
        sceneManager.current.update(stateRef.current, audio);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      sceneManager.current?.dispose();
    };
  }, []); // Only run on mount

  const handleToggleMic = async () => {
    if (state.micEnabled) {
      audioEngine.current.stop();
      setState(s => ({ ...s, micEnabled: false, isDemoMode: true }));
    } else {
      const success = await audioEngine.current.start();
      if (success) {
        setState(s => ({ ...s, micEnabled: true, isDemoMode: false }));
      } else {
        alert("Could not access microphone. Ensure permissions are granted.");
      }
    }
  };

  const handleReset = () => {
    setState(prev => ({
      ...INITIAL_STATE,
      micEnabled: prev.micEnabled,
      isDemoMode: prev.isDemoMode
    }));
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Background Canvas */}
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {/* Overlays */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        <div className="pointer-events-auto">
          <ControlsPanel 
            state={state} 
            setState={setState} 
            onToggleMic={handleToggleMic}
            onReset={handleReset}
          />
        </div>
        
        <AudioHUD audio={audioState} micEnabled={state.micEnabled} />

        {/* Minimal Instructions */}
        {!state.micEnabled && state.isDemoMode && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <h1 className="text-4xl font-black text-white/20 tracking-tighter uppercase select-none">
              Particle Playground
            </h1>
            <p className="text-sm text-white/40 mt-2 font-mono tracking-widest uppercase">
              Click Start Mic to control with voice
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
