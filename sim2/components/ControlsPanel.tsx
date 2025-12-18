
import React from 'react';
import { AppState, ParticleShape, ColorMode } from '../types';

interface ControlsPanelProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onToggleMic: () => void;
  onReset: () => void;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({ state, setState, onToggleMic, onReset }) => {
  const handleChange = (key: keyof AppState, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed top-4 right-4 w-72 max-h-[90vh] overflow-y-auto bg-black/60 backdrop-blur-md border border-white/20 rounded-xl p-5 shadow-2xl text-white select-none">
      <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-2">Controls</h2>
      
      {/* Audio Section */}
      <div className="mb-6 space-y-4">
        <button
          onClick={onToggleMic}
          className={`w-full py-2 rounded-lg font-semibold transition-all ${
            state.micEnabled 
              ? 'bg-red-500/80 hover:bg-red-500' 
              : 'bg-cyan-500/80 hover:bg-cyan-500'
          }`}
        >
          {state.micEnabled ? 'Stop Microphone' : 'Start Microphone'}
        </button>
        {state.isDemoMode && !state.micEnabled && (
          <p className="text-xs text-cyan-300 text-center animate-pulse">Running in Demo Mode</p>
        )}
      </div>

      {/* Visuals Section */}
      <div className="space-y-6">
        {/* Particle Count */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label>Particles</label>
            <span className="text-cyan-400 font-mono">{state.particleCount.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={state.particleCount}
            onChange={(e) => handleChange('particleCount', parseInt(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>

        {/* Particle Size */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label>Size</label>
            <span className="text-cyan-400 font-mono">{state.particleSize}px</span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="0.5"
            value={state.particleSize}
            onChange={(e) => handleChange('particleSize', parseFloat(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>

        {/* Shape Selection */}
        <div className="space-y-2">
          <label className="text-sm">Shape</label>
          <select
            value={state.shape}
            onChange={(e) => handleChange('shape', e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-sm focus:outline-none focus:border-cyan-400"
          >
            {Object.values(ParticleShape).map(s => (
              <option key={s} value={s} className="bg-zinc-900">{s.toLowerCase()}</option>
            ))}
          </select>
        </div>

        {/* Color Mode */}
        <div className="space-y-2">
          <label className="text-sm">Color Mode</label>
          <select
            value={state.colorMode}
            onChange={(e) => handleChange('colorMode', e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-sm focus:outline-none focus:border-cyan-400"
          >
            {Object.values(ColorMode).map(m => (
              <option key={m} value={m} className="bg-zinc-900">{m.toLowerCase()}</option>
            ))}
          </select>
        </div>

        {/* Color Pickers */}
        {state.colorMode !== ColorMode.RANDOM && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase opacity-60">Primary</label>
              <input
                type="color"
                value={state.primaryColor}
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                className="w-full h-8 bg-transparent rounded cursor-pointer"
              />
            </div>
            {state.colorMode === ColorMode.GRADIENT && (
              <div className="space-y-1">
                <label className="text-[10px] uppercase opacity-60">Secondary</label>
                <input
                  type="color"
                  value={state.secondaryColor}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  className="w-full h-8 bg-transparent rounded cursor-pointer"
                />
              </div>
            )}
          </div>
        )}

        {/* Sensitivity */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="space-y-2">
            <label className="text-sm">Loudness Sensitivity</label>
            <input
              type="range"
              min="0.1"
              max="5.0"
              step="0.1"
              value={state.loudnessSensitivity}
              onChange={(e) => handleChange('loudnessSensitivity', parseFloat(e.target.value))}
              className="w-full accent-pink-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm">Pitch Influence</label>
            <input
              type="range"
              min="0"
              max="5.0"
              step="0.1"
              value={state.pitchInfluence}
              onChange={(e) => handleChange('pitchInfluence', parseFloat(e.target.value))}
              className="w-full accent-pink-500"
            />
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-all text-white/60"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

export default ControlsPanel;
