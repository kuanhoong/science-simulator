export interface PlanetData {
  name: string;
  radius: number;
  distance: number;
  speed: number;
  tilt: number;
  rotationSpeed: number;
  color: string;
  textureUrl: string;
  info: string;
  hasRings?: boolean;
}

export type GestureType = 'zoom-in' | 'zoom-out' | 'none';

export interface GestureState {
  lastZoomGesture: 'open' | 'closed' | 'none';
  zoomFrames: number;
}

export const GESTURE_EVENT_NAME = 'gesture-control-event';

export interface GestureEventDetail {
  type: GestureType;
  strength?: number;
}

// Extend Window to include MediaPipe types loaded via script tags
declare global {
  interface Window {
    Hands: any;
    Camera: any;
  }
}