
import { AudioState } from '../types';

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  private dataArray: Float32Array = new Float32Array(0);
  
  private currentLoudness = 0;
  private currentPitch = 0;
  private currentPitchHz = 0;
  private currentConfidence = 0;

  constructor() {}

  async start(): Promise<boolean> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      
      this.microphone = this.audioContext.createMediaStreamSource(this.stream);
      this.microphone.connect(this.analyser);
      
      this.dataArray = new Float32Array(this.analyser.fftSize);
      return true;
    } catch (err) {
      console.error('Microphone access denied:', err);
      return false;
    }
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.microphone = null;
    this.analyser = null;
    this.audioContext = null;
  }

  update(): AudioState {
    if (!this.analyser) {
      // Demo mode fallback values
      const time = Date.now() * 0.001;
      return {
        loudnessNorm: 0.2 + Math.sin(time) * 0.1,
        pitchNorm: 0.5 + Math.cos(time * 0.5) * 0.3,
        pitchHz: 440 + Math.sin(time) * 100,
        confidence: 1.0
      };
    }

    this.analyser.getFloatTimeDomainData(this.dataArray);

    // 1. Calculate Loudness (RMS)
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i] * this.dataArray[i];
    }
    const rms = Math.sqrt(sum / this.dataArray.length);
    // Smooth the loudness
    this.currentLoudness = this.lerp(this.currentLoudness, rms, 0.2);

    // 2. Simple Autocorrelation for Pitch
    const pitchData = this.detectPitch(this.dataArray, this.audioContext?.sampleRate || 44100);
    if (pitchData.confidence > 0.1) {
      this.currentPitchHz = pitchData.pitch;
      this.currentConfidence = pitchData.confidence;
      // Normalize pitch (range 80Hz - 1000Hz approx)
      const norm = Math.max(0, Math.min(1, (this.currentPitchHz - 80) / 920));
      this.currentPitch = this.lerp(this.currentPitch, norm, 0.15);
    } else {
      this.currentConfidence = this.lerp(this.currentConfidence, 0, 0.05);
    }

    return {
      loudnessNorm: this.currentLoudness,
      pitchNorm: this.currentPitch,
      pitchHz: this.currentPitchHz,
      confidence: this.currentConfidence
    };
  }

  private lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  private detectPitch(buffer: Float32Array, sampleRate: number) {
    const SIZE = buffer.length;
    let bestOffset = -1;
    let bestCorrelation = 0;
    let rms = 0;

    for (let i = 0; i < SIZE; i++) {
      rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return { pitch: -1, confidence: 0 };

    const correlations = new Float32Array(SIZE);
    for (let offset = 0; offset < SIZE; offset++) {
      let correlation = 0;
      for (let i = 0; i < SIZE - offset; i++) {
        correlation += buffer[i] * buffer[i + offset];
      }
      correlations[offset] = correlation;
    }

    let d = 0;
    while (correlations[d] > correlations[d + 1]) d++;
    let maxval = -1;
    for (let i = d; i < SIZE; i++) {
      if (correlations[i] > maxval) {
        maxval = correlations[i];
        bestOffset = i;
      }
    }

    const confidence = maxval / correlations[0];
    const pitch = sampleRate / bestOffset;

    return { pitch, confidence };
  }
}
