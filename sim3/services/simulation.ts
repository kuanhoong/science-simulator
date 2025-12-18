import { Grid, ZoneType, CityStats, Tile } from '../types';
import { GRID_SIZE } from '../constants';

export const createInitialGrid = (): Grid => {
  const grid: Grid = [];
  for (let x = 0; x < GRID_SIZE; x++) {
    const row: Tile[] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      row.push({
        x,
        y,
        type: ZoneType.Empty,
        level: 0,
        updatedAt: 0,
      });
    }
    grid.push(row);
  }
  return grid;
};

const getNeighbors = (grid: Grid, x: number, y: number): Tile[] => {
  const neighbors: Tile[] = [];
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  for (const [dx, dy] of dirs) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
      neighbors.push(grid[nx][ny]);
    }
  }
  return neighbors;
};

export const runSimulationStep = (currentGrid: Grid, currentStats: CityStats): { newGrid: Grid; newStats: CityStats } => {
  // Deep copy grid to avoid mutation issues
  const newGrid = currentGrid.map(row => row.map(tile => ({ ...tile })));
  let newPopulation = 0;
  let newIncome = 0;

  // 1. Calculate Growth and Levels
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      const tile = newGrid[x][y];
      const neighbors = getNeighbors(currentGrid, x, y);
      const hasRoadAccess = neighbors.some(n => n.type === ZoneType.Road);
      
      // Residential Logic
      if (tile.type === ZoneType.Residential) {
        if (hasRoadAccess) {
          // Chance to grow if near road
          if (Math.random() > 0.7 && tile.level < 4) {
            tile.level++;
          }
        } else {
          // Decay if no road
          if (Math.random() > 0.8 && tile.level > 0) tile.level--;
        }
        newPopulation += tile.level * 2; // Each level adds 2 pop
        newIncome += tile.level * 1; // Tax revenue
      }

      // Commercial Logic
      if (tile.type === ZoneType.Commercial) {
        const nearResidential = neighbors.some(n => n.type === ZoneType.Residential && n.level > 0);
        if (hasRoadAccess && nearResidential) {
           if (Math.random() > 0.6 && tile.level < 4) {
             tile.level++;
           }
        }
        newIncome += tile.level * 3; // Higher tax
      }

      // Industrial Logic
      if (tile.type === ZoneType.Industrial) {
        if (hasRoadAccess) {
          if (Math.random() > 0.6 && tile.level < 4) {
            tile.level++;
          }
        }
        newIncome += tile.level * 2;
      }
    }
  }

  const newStats = {
    ...currentStats,
    day: currentStats.day + 1,
    population: newPopulation,
    income: newIncome,
    funds: currentStats.funds + newIncome
  };

  return { newGrid, newStats };
};
