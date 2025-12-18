import { ZoneType, Tool } from './types';

export const GRID_SIZE = 20;
export const TICK_RATE_MS = 1000; // Simulation updates every 1 second
export const INITIAL_FUNDS = 5000;

export const ZONE_COLORS: Record<ZoneType, string> = {
  [ZoneType.Empty]: '#4ade80', // Grass green
  [ZoneType.Residential]: '#22c55e', // Darker green building
  [ZoneType.Commercial]: '#3b82f6', // Blue
  [ZoneType.Industrial]: '#eab308', // Yellow
  [ZoneType.Road]: '#374151', // Road grey
  [ZoneType.Power]: '#a855f7', // Purple
};

export const TOOLS: Tool[] = [
  { id: 'Bulldoze', label: 'Bulldoze', cost: 5, color: '#ef4444' },
  { id: ZoneType.Road, label: 'Road', cost: 10, color: '#374151' },
  { id: ZoneType.Residential, label: 'Residential', cost: 50, color: '#22c55e' },
  { id: ZoneType.Commercial, label: 'Commercial', cost: 100, color: '#3b82f6' },
  { id: ZoneType.Industrial, label: 'Industrial', cost: 150, color: '#eab308' },
  { id: ZoneType.Power, label: 'Power', cost: 500, color: '#a855f7' },
];

export const LEVEL_HEIGHT_MULTIPLIER = 0.4;