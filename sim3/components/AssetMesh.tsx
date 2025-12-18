import React, { useMemo } from 'react';
import { Tile, ZoneType } from '../types';
import { ZONE_COLORS, LEVEL_HEIGHT_MULTIPLIER } from '../constants';
import * as THREE from 'three';

interface AssetMeshProps {
  tile: Tile;
  onClick: (e: any) => void;
  onPointerOver: (e: any) => void;
  onPointerOut: (e: any) => void;
}

const AssetMesh: React.FC<AssetMeshProps> = ({ tile, onClick, onPointerOver, onPointerOut }) => {
  const { x, y, type, level } = tile;
  
  // Base position centered on grid
  const position: [number, number, number] = [x, 0, y];
  
  // Ground color
  const color = ZONE_COLORS[type];

  // Render logic based on type
  if (type === ZoneType.Empty) {
    return (
      <mesh 
        position={[x, -0.05, y]} 
        onClick={onClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        <boxGeometry args={[0.95, 0.1, 0.95]} />
        <meshStandardMaterial color={color} />
      </mesh>
    );
  }

  if (type === ZoneType.Road) {
    return (
      <mesh 
        position={[x, 0.01, y]} 
        onClick={onClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    );
  }

  if (type === ZoneType.Power) {
    return (
        <group position={position}>
             {/* Ground Base */}
             <mesh position={[0, 0.01, 0]} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
               <planeGeometry args={[0.95, 0.95]} rotation={[-Math.PI/2, 0, 0]} />
               <meshStandardMaterial color={color} opacity={0.8} transparent />
             </mesh>
             
             {/* Power Plant Base */}
             <mesh position={[0, 0.2, 0]}>
                <boxGeometry args={[0.8, 0.4, 0.8]} />
                <meshStandardMaterial color="#7e22ce" />
             </mesh>
             
             {/* Smokestack */}
             <mesh position={[0.2, 0.6, 0.2]}>
                <cylinderGeometry args={[0.1, 0.15, 0.6, 16]} />
                <meshStandardMaterial color="#581c87" />
             </mesh>
        </group>
    );
  }

  // Buildings (R, C, I)
  // Height increases with level. Level 0 = just allocated land (flat)
  const height = Math.max(0.1, level * LEVEL_HEIGHT_MULTIPLIER + 0.2);
  const yPos = height / 2;

  return (
    <group position={position}>
       {/* Ground Base */}
       <mesh position={[0, 0.01, 0]} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
         <planeGeometry args={[0.95, 0.95]} rotation={[-Math.PI/2, 0, 0]} />
         <meshStandardMaterial color={color} opacity={0.5} transparent />
       </mesh>

       {/* Building Block */}
       {level > 0 && (
          <mesh position={[0, yPos, 0]}>
            <boxGeometry args={[0.7, height, 0.7]} />
            <meshStandardMaterial color={color} />
             <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(0.7, height, 0.7)]} />
                <lineBasicMaterial color="black" linewidth={1} opacity={0.2} transparent />
             </lineSegments>
          </mesh>
       )}
    </group>
  );
};

export default React.memo(AssetMesh);