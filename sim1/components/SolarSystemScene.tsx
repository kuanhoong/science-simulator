import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { PLANETS } from '../constants';
import { PlanetData, GESTURE_EVENT_NAME, GestureEventDetail } from '../types';

const Planet: React.FC<{
  data: PlanetData;
  onSelect: (data: PlanetData) => void;
}> = ({ data, onSelect }) => {
  // We use separate refs for separate transforms to avoid rotation order issues
  const orbitGroupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Random start angle for orbit
  const initialAngle = useMemo(() => Math.random() * Math.PI * 2, []);
  
  useFrame(({ clock }) => {
    // 1. Orbital Movement (Translation)
    if (orbitGroupRef.current && data.distance > 0) {
      const t = clock.getElapsedTime() * (data.speed * 0.5) + initialAngle;
      orbitGroupRef.current.position.x = Math.cos(t) * data.distance;
      orbitGroupRef.current.position.z = Math.sin(t) * data.distance;
    }

    // 2. Axial Rotation (Spin)
    if (meshRef.current) {
      meshRef.current.rotation.y += data.rotationSpeed;
    }
  });

  const texture = useLoader(THREE.TextureLoader, data.textureUrl);

  return (
    <group>
      {/* Orbit Path Visual */}
      {data.distance > 0 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[data.distance - 0.1, data.distance + 0.1, 128]} />
          <meshBasicMaterial color="#333" side={THREE.DoubleSide} transparent opacity={0.3} />
        </mesh>
      )}
      
      {/* Moving Planet Group */}
      <group ref={orbitGroupRef} position={[data.distance, 0, 0]}>
        {/* Axial Tilt Container */}
        <group rotation={[data.tilt * Math.PI / 180, 0, 0]}>
          {/* Spinning Mesh */}
          <mesh 
            ref={meshRef} 
            onClick={(e) => {
              e.stopPropagation();
              onSelect(data);
            }}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; }}
          >
            <sphereGeometry args={[data.radius, 32, 32]} />
            <meshStandardMaterial 
              map={texture} 
              emissive={data.name === 'Sun' ? new THREE.Color("#FDB813") : new THREE.Color("#000")}
              emissiveIntensity={data.name === 'Sun' ? 0.8 : 0}
              color={data.name === 'Sun' ? "#FDB813" : "white"}
            />
            
            {/* Saturn Rings */}
            {data.hasRings && (
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[data.radius * 1.4, data.radius * 2.2, 64]} />
                <meshStandardMaterial color="#C5AB6E" side={THREE.DoubleSide} opacity={0.8} transparent />
              </mesh>
            )}

            {/* Planet Label */}
            <Html position={[0, data.radius + 1, 0]} center distanceFactor={15} style={{pointerEvents: 'none'}}>
              <div className="text-white text-xs font-mono bg-black/50 px-1 rounded whitespace-nowrap">
                {data.name}
              </div>
            </Html>
          </mesh>
        </group>
      </group>
    </group>
  );
};

const SceneContent: React.FC<{
  setPlanetInfo: (p: PlanetData | null) => void;
}> = ({ setPlanetInfo }) => {
  const controlsRef = useRef<any>(null);

  // Gesture Listener
  useEffect(() => {
    const handleGesture = (e: Event) => {
      const customEvent = e as CustomEvent<GestureEventDetail>;
      const controls = controlsRef.current;
      if (!controls) return;

      const { type } = customEvent.detail;

      switch (type) {
        case 'zoom-in':
          const camera = controls.object;
          const target = controls.target;
          const vecIn = new THREE.Vector3().subVectors(camera.position, target);
          const lenIn = vecIn.length();
          if (lenIn > 10) { 
             vecIn.setLength(Math.max(10, lenIn * 0.98));
             camera.position.copy(target).add(vecIn);
             controls.update();
          }
          break;

        case 'zoom-out':
          const cam = controls.object;
          const tgt = controls.target;
          const vecOut = new THREE.Vector3().subVectors(cam.position, tgt);
          const lenOut = vecOut.length();
          if (lenOut < 500) { 
             vecOut.setLength(lenOut * 1.02);
             cam.position.copy(tgt).add(vecOut);
             controls.update();
          }
          break;
      }
    };

    window.addEventListener(GESTURE_EVENT_NAME, handleGesture);
    return () => window.removeEventListener(GESTURE_EVENT_NAME, handleGesture);
  }, []);

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={2.5} decay={0} distance={1000} color="#ffaa00" />
      <pointLight position={[0, 0, 0]} intensity={1.5} decay={2} distance={100} color="white" />
      
      <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {PLANETS.map((planet) => (
        <Planet key={planet.name} data={planet} onSelect={setPlanetInfo} />
      ))}

      <OrbitControls 
        ref={controlsRef}
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        minDistance={10}
        maxDistance={500}
      />
    </>
  );
};

export const SolarSystemScene: React.FC<{
  onSelectPlanet: (p: PlanetData | null) => void;
}> = ({ onSelectPlanet }) => {
  return (
    <Canvas camera={{ position: [0, 50, 100], fov: 60 }} dpr={[1, 2]} shadows>
      <SceneContent setPlanetInfo={onSelectPlanet} />
    </Canvas>
  );
};