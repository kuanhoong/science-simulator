
import React from 'react';
import { AudioState } from '../types';

interface AudioHUDProps {
  audio: AudioState;
  micEnabled: boolean;
}

const AudioHUD: React.FC<AudioHUDProps> = ({ audio, micEnabled }) => {
  return (
    <div className="fixed bottom-6 left-6 flex flex-col gap-3 pointer-events-none select-none">
      <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm border border-white/10 p-3 rounded-lg min-w-[160px]">
        <div className={`w-3 h-3 rounded-full ${micEnabled ? 'bg-red-500 animate-pulse' : 'bg-zinc-600'}`} />
        <span className="text-xs font-mono uppercase tracking-widest text-white/80">
          Mic {micEnabled ? 'Live' : 'Off'}
        </span>
      </div>

      <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-4 rounded-lg space-y-4 min-w-[200px]">
        {/* Loudness Meter */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-white/50 uppercase tracking-tighter">
            <span>Amplitude</span>
            <span>{Math.round(audio.loudnessNorm * 100)}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-400 transition-all duration-75" 
              style={{ width: `${Math.min(100, audio.loudnessNorm * 200)}%` }}
            />
          </div>
        </div>

        {/* Pitch Display */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-white/50 uppercase tracking-tighter">
            <span>Fundamental</span>
            <span>{audio.confidence > 0.1 ? `${Math.round(audio.pitchHz)} Hz` : '---'}</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-pink-500 transition-all duration-150" 
              style={{ 
                width: `${audio.pitchNorm * 100}%`,
                opacity: Math.max(0.2, audio.confidence)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioHUD;
