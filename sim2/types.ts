
export enum ParticleShape {
  CIRCLE = 'CIRCLE',
  SQUARE = 'SQUARE',
  TRIANGLE = 'TRIANGLE',
  STAR = 'STAR'
}

export enum ColorMode {
  SINGLE = 'SINGLE',
  GRADIENT = 'GRADIENT',
  RANDOM = 'RANDOM'
}

export interface AppState {
  particleCount: number;
  particleSize: number;
  shape: ParticleShape;
  colorMode: ColorMode;
  primaryColor: string;
  secondaryColor: string;
  loudnessSensitivity: number;
  pitchInfluence: number;
  micEnabled: boolean;
  isDemoMode: boolean;
}

export interface AudioState {
  loudnessNorm: number;
  pitchNorm: number;
  pitchHz: number;
  confidence: number;
}
