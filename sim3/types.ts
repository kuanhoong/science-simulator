export enum ZoneType {
  Empty = 'Empty',
  Residential = 'Residential',
  Commercial = 'Commercial',
  Industrial = 'Industrial',
  Road = 'Road',
  Power = 'Power'
}

export interface Tile {
  x: number;
  y: number;
  type: ZoneType;
  level: number; // 0 to 4
  updatedAt: number;
}

export interface CityStats {
  population: number;
  funds: number;
  day: number;
  income: number;
}

export type Grid = Tile[][];

export interface Tool {
  id: ZoneType | 'Bulldoze';
  label: string;
  cost: number;
  color: string;
}