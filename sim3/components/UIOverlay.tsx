import React, { useState } from 'react';
import { CityStats, Tool, ZoneType } from '../types';
import { TOOLS } from '../constants';
import { Bot, Hammer, Map, Building, Factory, Truck, MousePointer2, Zap, Pause, Play } from 'lucide-react';
import { getAIAdvice } from '../services/geminiService';

interface UIOverlayProps {
  stats: CityStats;
  selectedTool: Tool;
  onSelectTool: (tool: Tool) => void;
  grid: any; // Passed for AI analysis
  paused: boolean;
  onTogglePause: () => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ stats, selectedTool, onSelectTool, grid, paused, onTogglePause }) => {
  const [advice, setAdvice] = useState<string>("");
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const handleConsultAI = async () => {
    setLoadingAdvice(true);
    setAdvice("Connecting to City Hall mainframe...");
    const result = await getAIAdvice(stats, grid);
    setAdvice(result);
    setLoadingAdvice(false);
  };

  const getIcon = (id: string) => {
      switch(id) {
          case 'Bulldoze': return <Hammer size={18} />;
          case ZoneType.Road: return <Map size={18} />;
          case ZoneType.Residential: return <Building size={18} />;
          case ZoneType.Commercial: return <Truck size={18} />;
          case ZoneType.Industrial: return <Factory size={18} />;
          case ZoneType.Power: return <Zap size={18} />;
          default: return <MousePointer2 size={18} />;
      }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
      {/* Top Bar: Stats */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="bg-slate-900/90 text-white p-4 rounded-lg shadow-xl border border-slate-700 backdrop-blur-sm min-w-[200px]">
          <div className="flex justify-between items-center mb-2 border-b border-slate-700 pb-2">
              <h1 className="text-xl font-bold text-blue-400">ReactCity</h1>
              <button 
                onClick={onTogglePause}
                className={`p-1 rounded-full hover:bg-slate-700 transition-colors ${paused ? 'bg-red-900/50 text-red-400' : 'bg-green-900/50 text-green-400'}`}
                title={paused ? "Resume Simulation" : "Pause Simulation"}
              >
                  {paused ? <Play size={20} /> : <Pause size={20} />}
              </button>
          </div>
          <div className="space-y-1 text-sm font-mono">
             <div className="flex justify-between"><span>POP:</span> <span className="text-green-400">{stats.population}</span></div>
             <div className="flex justify-between"><span>FUNDS:</span> <span className="text-yellow-400">${stats.funds}</span></div>
             <div className="flex justify-between"><span>INCOME:</span> <span className={stats.income >= 0 ? "text-green-400" : "text-red-400"}>${stats.income}/day</span></div>
             <div className="flex justify-between"><span>DAY:</span> <span className="text-blue-300">{stats.day}</span></div>
          </div>
        </div>
        
        {/* AI Advisor Panel */}
        <div className="bg-slate-900/90 text-white p-4 rounded-lg shadow-xl border border-slate-700 backdrop-blur-sm max-w-sm ml-4">
            <div className="flex items-center gap-2 mb-2">
                <Bot className="text-purple-400" />
                <h2 className="font-bold text-purple-400">AI Advisor</h2>
            </div>
            {advice ? (
                <p className="text-xs text-slate-300 italic mb-3 leading-relaxed border-l-2 border-purple-500 pl-2">
                    "{advice}"
                </p>
            ) : (
                <p className="text-xs text-slate-500 mb-3">Consult the AI mayor for city planning tips.</p>
            )}
            <button 
                onClick={handleConsultAI}
                disabled={loadingAdvice}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-xs py-2 px-3 rounded uppercase font-bold tracking-wider transition-colors"
            >
                {loadingAdvice ? 'Thinking...' : 'Consult Advisor'}
            </button>
        </div>
      </div>

      {/* Bottom Bar: Tools */}
      <div className="pointer-events-auto flex justify-center pb-4">
        <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-700 shadow-2xl backdrop-blur-md flex gap-2">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool)}
              className={`
                flex flex-col items-center justify-center w-20 h-20 rounded-lg transition-all
                ${selectedTool.id === tool.id 
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] translate-y-[-4px]' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}
              `}
            >
              <div className="mb-1" style={{color: selectedTool.id !== tool.id ? tool.color : 'white'}}>
                  {getIcon(tool.id.toString())}
              </div>
              <span className="text-[10px] font-bold uppercase">{tool.label}</span>
              <span className="text-[9px] opacity-70">${tool.cost}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UIOverlay;