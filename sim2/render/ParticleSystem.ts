
import * as THREE from 'three';
import { AppState, ParticleShape, ColorMode, AudioState } from '../types';
import { vertexShader, fragmentShader } from './Shaders';

export class ParticleSystem {
  public mesh: THREE.Points;
  private geometry: THREE.BufferGeometry;
  private material: THREE.ShaderMaterial;
  private count: number;

  constructor(count: number) {
    this.count = count;
    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uLoudness: { value: 0 },
        uPitch: { value: 0 },
        uSize: { value: 1.5 },
        uColor1: { value: new THREE.Color(0x00ffff) },
        uColor2: { value: new THREE.Color(0xff00ff) },
        uColorMode: { value: 0 },
        uShape: { value: 0 },
        uSensitivity: { value: 1.0 },
        uInfluence: { value: 1.0 }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.initGeometry();
    this.mesh = new THREE.Points(this.geometry, this.material);
  }

  private initGeometry() {
    const positions = new Float32Array(this.count * 3);
    const randoms = new Float32Array(this.count);
    const offsets = new Float32Array(this.count * 3);

    // Distribute particles along a horizontal band (X axis) to support wave forms
    for (let i = 0; i < this.count; i++) {
      // X spread: from -12 to 12
      positions[i * 3 + 0] = (Math.random() - 0.5) * 24.0;
      // Y and Z spread: small initial variance
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2.0;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2.0;

      randoms[i] = Math.random();

      // Offsets used for phase and unique movement
      offsets[i * 3 + 0] = Math.random() * Math.PI * 2;
      offsets[i * 3 + 1] = Math.random() * Math.PI * 2;
      offsets[i * 3 + 2] = Math.random() * Math.PI * 2;
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    this.geometry.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 3));
  }

  updateCount(newCount: number) {
    if (this.count === newCount) return;
    this.count = newCount;
    this.geometry.dispose();
    this.geometry = new THREE.BufferGeometry();
    this.initGeometry();
    this.mesh.geometry = this.geometry;
  }

  update(audio: AudioState, state: AppState, time: number) {
    this.material.uniforms.uTime.value = time;
    this.material.uniforms.uLoudness.value = audio.loudnessNorm;
    this.material.uniforms.uPitch.value = audio.pitchNorm;
    this.material.uniforms.uSize.value = state.particleSize;
    this.material.uniforms.uSensitivity.value = state.loudnessSensitivity;
    this.material.uniforms.uInfluence.value = state.pitchInfluence;
    
    this.material.uniforms.uColor1.value.set(state.primaryColor);
    this.material.uniforms.uColor2.value.set(state.secondaryColor);
    
    const shapeMap: Record<ParticleShape, number> = {
      [ParticleShape.CIRCLE]: 0,
      [ParticleShape.SQUARE]: 1,
      [ParticleShape.TRIANGLE]: 2,
      [ParticleShape.STAR]: 3
    };
    this.material.uniforms.uShape.value = shapeMap[state.shape];

    const modeMap: Record<ColorMode, number> = {
      [ColorMode.SINGLE]: 0,
      [ColorMode.GRADIENT]: 1,
      [ColorMode.RANDOM]: 2
    };
    this.material.uniforms.uColorMode.value = modeMap[state.colorMode];
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
