import { PlanetData } from './types';

export const PLANETS: PlanetData[] = [
  {
    name: "Sun",
    radius: 8,
    distance: 0,
    speed: 0,
    tilt: 0,
    rotationSpeed: 0.004,
    color: "#FDB813",
    textureUrl: "https://picsum.photos/id/10/512/256",
    info: "Diameter: 1.391 million km\nMass: 1.989 × 10³⁰ kg\nType: G-type main-sequence star\nCore Temp: 15 million °C"
  },
  {
    name: "Mercury",
    radius: 0.8,
    distance: 14,
    speed: 0.4,
    tilt: 0.034,
    rotationSpeed: 0.02,
    color: "#B7B8B9",
    textureUrl: "https://picsum.photos/id/20/512/256",
    info: "Diameter: 4,879 km\nOrbit: 88 days\nSurface Temp: -173°C to 427°C\nSmallest planet, no atmosphere"
  },
  {
    name: "Venus",
    radius: 1.5,
    distance: 22,
    speed: 0.3,
    tilt: 177.4,
    rotationSpeed: 0.015,
    color: "#E3BB76",
    textureUrl: "https://picsum.photos/id/30/512/256",
    info: "Diameter: 12,104 km\nOrbit: 225 days\nSurface Temp: 464°C\nHottest planet, rotates retrograde"
  },
  {
    name: "Earth",
    radius: 1.6,
    distance: 32,
    speed: 0.2,
    tilt: 23.5,
    rotationSpeed: 0.05,
    color: "#4F4CB0",
    textureUrl: "https://picsum.photos/id/40/512/256",
    info: "Diameter: 12,742 km\nOrbit: 365.25 days\nSurface Temp: -88°C to 58°C\nOnly planet with known life"
  },
  {
    name: "Mars",
    radius: 1.2,
    distance: 42,
    speed: 0.16,
    tilt: 25.2,
    rotationSpeed: 0.04,
    color: "#E27B58",
    textureUrl: "https://picsum.photos/id/50/512/256",
    info: "Diameter: 6,792 km\nOrbit: 687 days\nThin CO₂ atmosphere\nRed due to iron oxide"
  },
  {
    name: "Jupiter",
    radius: 4.5,
    distance: 60,
    speed: 0.08,
    tilt: 3.1,
    rotationSpeed: 0.08,
    color: "#C88B3A",
    textureUrl: "https://picsum.photos/id/60/512/256",
    info: "Diameter: 139,820 km\nOrbit: 11.86 years\nGas giant\nLargest planet, Great Red Spot"
  },
  {
    name: "Saturn",
    radius: 3.8,
    distance: 80,
    speed: 0.06,
    tilt: 26.7,
    rotationSpeed: 0.07,
    color: "#C5AB6E",
    hasRings: true,
    textureUrl: "https://picsum.photos/id/70/512/256",
    info: "Diameter: 116,460 km\nOrbit: 29.46 years\nFamous rings\nGas giant"
  },
  {
    name: "Uranus",
    radius: 2.5,
    distance: 98,
    speed: 0.04,
    tilt: 97.8,
    rotationSpeed: 0.06,
    color: "#4FD0E7",
    textureUrl: "https://picsum.photos/id/80/512/256",
    info: "Diameter: 50,724 km\nOrbit: 84 years\nIce giant\nSideways rotation"
  },
  {
    name: "Neptune",
    radius: 2.4,
    distance: 115,
    speed: 0.03,
    tilt: 28.3,
    rotationSpeed: 0.06,
    color: "#4b70dd",
    textureUrl: "https://picsum.photos/id/90/512/256",
    info: "Diameter: 49,244 km\nOrbit: 164.8 years\nIce giant\nStrongest winds"
  }
];