
import * as THREE from 'three';
import { ParticleSystem } from './ParticleSystem';
import { AppState, AudioState } from '../types';

export class SceneManager {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private particleSystem: ParticleSystem;
  private container: HTMLElement;
  private clock: THREE.Clock;
  private mouse: THREE.Vector2;
  private targetRotation: THREE.Vector2;
  private currentRotation: THREE.Vector2;

  constructor(container: HTMLElement, initialState: AppState) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 15; // Moved back slightly

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    this.particleSystem = new ParticleSystem(initialState.particleCount);
    this.scene.add(this.particleSystem.mesh);

    this.clock = new THREE.Clock();
    this.mouse = new THREE.Vector2(0, 0);
    this.targetRotation = new THREE.Vector2(0, 0);
    this.currentRotation = new THREE.Vector2(0, 0);

    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onMouseMove);
  }

  private onResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  private onMouseMove = (event: MouseEvent) => {
    // Normalize mouse coordinates (-1 to +1)
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Set target rotation based on mouse position
    this.targetRotation.x = this.mouse.y * 0.5; // Up/down tilt
    this.targetRotation.y = this.mouse.x * 0.5; // Left/right tilt
  };

  update(state: AppState, audio: AudioState) {
    const time = this.clock.getElapsedTime();
    
    // Smooth camera rotation based on mouse
    this.currentRotation.x = THREE.MathUtils.lerp(this.currentRotation.x, this.targetRotation.x, 0.05);
    this.currentRotation.y = THREE.MathUtils.lerp(this.currentRotation.y, this.targetRotation.y, 0.05);
    
    this.scene.rotation.x = this.currentRotation.x;
    this.scene.rotation.y = this.currentRotation.y;

    // Smooth camera zoom based on audio
    const targetZ = 15 - audio.loudnessNorm * state.loudnessSensitivity * 4;
    this.camera.position.z = THREE.MathUtils.lerp(this.camera.position.z, targetZ, 0.1);
    
    // Add a continuous slow rotation
    this.scene.rotation.y += 0.002 + audio.pitchNorm * state.pitchInfluence * 0.02;

    if (this.particleSystem) {
      this.particleSystem.updateCount(state.particleCount);
      this.particleSystem.update(audio, state, time);
    }

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);
    this.particleSystem.dispose();
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
