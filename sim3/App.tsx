import React, { useState, useEffect, useCallback } from 'react';
import { createInitialGrid, runSimulationStep } from './services/simulation';
import { CityStats, Grid, Tool, ZoneType } from './types';
import { INITIAL_FUNDS, TICK_RATE_MS, TOOLS } from './constants';
import GameCanvas from './components/GameCanvas';
import UIOverlay from './components/UIOverlay';

const App: React.FC = () => {
  // Game State
  const [grid, setGrid] = useState<Grid>(createInitialGrid());
  const [stats, setStats] = useState<CityStats>({
    population: 0,
    funds: INITIAL_FUNDS,
    day: 1,
    income: 0
  });
  const [selectedTool, setSelectedTool] = useState<Tool>(TOOLS.find(t => t.id === ZoneType.Road) || TOOLS[0]);
  const [paused, setPaused] = useState(false);

  // Unified Simulation Loop
  useEffect(() => {
    if (paused) return;

    const timer = setTimeout(() => {
        const { newGrid, newStats } = runSimulationStep(grid, stats);
        setGrid(newGrid);
        setStats(newStats);
    }, TICK_RATE_MS);

    return () => clearTimeout(timer);
  }, [grid, stats, paused]);

  const handleTileClick = useCallback((x: number, y: number) => {
    const tile = grid[x][y];
    const cost = selectedTool.cost;

    // Validation
    if (stats.funds < cost) {
      alert("Insufficient funds!");
      return;
    }

    let newType = tile.type;
    let newLevel = tile.level;

    if (selectedTool.id === 'Bulldoze') {
      newType = ZoneType.Empty;
      newLevel = 0;
    } else {
      if (tile.type !== ZoneType.Empty && tile.type !== selectedTool.id) {
        // Cannot build over existing non-empty tiles unless bulldozing
        return; 
      }
      if (tile.type !== ZoneType.Empty && tile.type === selectedTool.id) {
          // Already this type
          return;
      }
      newType = selectedTool.id as ZoneType;
      // Buildings start at level 1, Roads/Power at 0 or 1 depending on visual preference
      // For now, Power is just a placed asset, level doesn't matter much visually but we set to 1 to indicate 'built'
      newLevel = (newType === ZoneType.Road || newType === ZoneType.Power) ? 0 : 1; 
    }

    // Update Grid
    const newGrid = [...grid];
    newGrid[x] = [...newGrid[x]];
    newGrid[x][y] = {
      ...tile,
      type: newType,
      level: newLevel,
      updatedAt: Date.now()
    };

    setGrid(newGrid);
    setStats(prev => ({ ...prev, funds: prev.funds - cost }));

  }, [grid, selectedTool, stats.funds]);

  return (
    <div className="w-full h-screen bg-neutral-900 flex flex-col">
      <div className="flex-1 relative">
        <GameCanvas grid={grid} onTileClick={handleTileClick} />
        <UIOverlay 
            stats={stats} 
            selectedTool={selectedTool} 
            onSelectTool={setSelectedTool} 
            grid={grid}
            paused={paused}
            onTogglePause={() => setPaused(!paused)}
        />
      </div>
    </div>
  );
};

export default App;