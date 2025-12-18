import React, { useState, Suspense } from 'react';
import { SolarSystemScene } from './components/SolarSystemScene';
import { GestureController } from './components/GestureController';
import { PlanetData } from './types';

const LoadingScreen = () => (
  <div className="flex items-center justify-center w-full h-full">
    <div className="text-blue-400 text-xl font-light tracking-widest animate-pulse">
      INITIALIZING SYSTEM...
    </div>
  </div>
);

const App: React.FC = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden font-sans">
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<LoadingScreen />}>
          <SolarSystemScene onSelectPlanet={setSelectedPlanet} />
        </Suspense>
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 p-6 z-10 pointer-events-none">
        <h1 className="text-3xl font-extralight tracking-[0.2em] text-white opacity-90 drop-shadow-lg">
          SOLAR <span className="font-bold text-blue-400">SYSTEM</span>
        </h1>
        <p className="text-xs text-blue-200/60 mt-1 tracking-widest uppercase">
          Interactive 3D Simulator
        </p>
      </div>

      {/* Selected Planet Info */}
      {selectedPlanet && (
        <div className="absolute top-24 left-6 z-10 w-80 pointer-events-auto">
          <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-5 text-white shadow-2xl transform transition-all duration-300 hover:border-blue-500/30">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                {selectedPlanet.name}
              </h2>
              <button 
                onClick={() => setSelectedPlanet(null)}
                className="text-gray-500 hover:text-red-400 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="h-px w-full bg-gradient-to-r from-blue-500/50 to-transparent"></div>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line font-light">
                {selectedPlanet.info}
              </p>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white/5 rounded-lg p-2.5">
                  <div className="text-[10px] uppercase text-gray-500 tracking-wider">Distance</div>
                  <div className="text-sm font-mono text-blue-300">{selectedPlanet.distance} AU</div>
                </div>
                <div className="bg-white/5 rounded-lg p-2.5">
                  <div className="text-[10px] uppercase text-gray-500 tracking-wider">Radius</div>
                  <div className="text-sm font-mono text-blue-300">{selectedPlanet.radius} u</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gesture Controls Overlay */}
      <GestureController />

      {/* Instructions Footer */}
      <div className="absolute bottom-6 left-6 z-10 pointer-events-none">
        <div className="text-[10px] text-gray-500 tracking-wider uppercase bg-black/40 backdrop-blur px-3 py-1 rounded-full border border-white/5">
          Powered by React Three Fiber & MediaPipe
        </div>
      </div>
    </div>
  );
};

export default App;