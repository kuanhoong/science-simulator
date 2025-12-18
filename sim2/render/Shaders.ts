
export const vertexShader = `
  uniform float uTime;
  uniform float uLoudness;
  uniform float uPitch;
  uniform float uSize;
  uniform float uSensitivity;
  uniform float uInfluence;
  
  attribute float aRandom;
  attribute vec3 aOffset;

  varying float vRandom;
  varying vec3 vPosition;

  void main() {
    vRandom = aRandom;
    
    vec3 pos = position;

    float loudness = uLoudness * uSensitivity;
    float pitch = uPitch * uInfluence;

    // Wave parameters
    float speed = 2.0 + pitch * 5.0;
    float frequency = 0.5 + pitch * 2.0;
    float amplitude = 0.5 + loudness * 4.0;

    // Primary wave motion along the ribbon
    float wave = sin(pos.x * frequency + uTime * speed + aOffset.x) * amplitude;
    
    // Add multiple harmonics for complexity
    wave += sin(pos.x * frequency * 2.5 + uTime * speed * 1.5) * (amplitude * 0.3);
    wave += cos(pos.x * 0.5 + uTime) * 0.2;

    pos.y += wave;

    // Add some Z-depth wave as well
    pos.z += cos(pos.x * (frequency * 0.8) + uTime * speed * 0.7) * (amplitude * 0.5);

    // Gentle random jitter
    pos.y += sin(uTime * 5.0 + aRandom * 10.0) * 0.05;

    vPosition = pos;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Size attenuation - adjusted for smaller, crisper particles
    gl_PointSize = uSize * (150.0 / -mvPosition.z) * (1.0 + loudness * 0.5);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const fragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform int uColorMode;
  uniform int uShape;
  uniform float uTime;

  varying float vRandom;
  varying vec3 vPosition;

  // SDF Shapes
  float sdCircle(vec2 p, float r) {
    return length(p) - r;
  }

  float sdSquare(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
  }

  float sdTriangle(vec2 p, float r) {
    const float k = sqrt(3.0);
    p.x = abs(p.x) - r;
    p.y = p.y + r / k;
    if (p.x + k * p.y > 0.0) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
    p.x -= clamp(p.x, -2.0 * r, 0.0);
    return -length(p) * sign(p.y);
  }

  float sdStar(vec2 p, float r, int n, float m) {
    float a = atan(p.y, p.x);
    float b = 6.28318530718 / float(n);
    float f = cos(floor(0.5 + a / b) * b - a) * length(p);
    return f - r;
  }

  void main() {
    vec2 p = gl_PointCoord - vec2(0.5);
    float dist = 0.0;

    if (uShape == 0) { // CIRCLE
      dist = sdCircle(p, 0.45);
    } else if (uShape == 1) { // SQUARE
      dist = sdSquare(p, vec2(0.4));
    } else if (uShape == 2) { // TRIANGLE
      dist = sdTriangle(p * 2.0, 0.5);
    } else if (uShape == 3) { // STAR
      dist = sdStar(p, 0.3, 5, 0.5);
    }

    if (dist > 0.0) discard;

    vec3 color = uColor1;
    if (uColorMode == 1) { // GRADIENT
      // Gradient based on X position for a flowing wave look
      float t = (vPosition.x + 12.0) / 24.0;
      color = mix(uColor1, uColor2, clamp(t, 0.0, 1.0));
    } else if (uColorMode == 2) { // RANDOM
      color = vec3(vRandom, fract(vRandom * 10.0), fract(vRandom * 100.0));
    }

    // Alpha falloff
    float alpha = 1.0 - smoothstep(0.3, 0.5, length(p));
    gl_FragColor = vec4(color, alpha);
  }
`;
