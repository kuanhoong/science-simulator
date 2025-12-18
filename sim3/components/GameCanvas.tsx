import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Stars, Environment } from '@react-three/drei';
import { Grid, Tile } from '../types';
import AssetMesh from './AssetMesh';
import { GRID_SIZE } from '../constants';

interface GameCanvasProps {
  grid: Grid;
  onTileClick: (x: number, y: number) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ grid, onTileClick }) => {
  const [hovered, setHovered] = useState<{x: number, y: number} | null>(null);

  // Calculate center of grid for camera target
  const center = GRID_SIZE / 2;

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        camera={{ position: [center + 10, 15, center + 10], fov: 45 }}
        gl={{ antialias: true }}
      >
        <Sky sunPosition={[100, 20, 100]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[center, 20, center]} intensity={1.5} castShadow />
        <directionalLight position={[10, 20, 5]} intensity={1} castShadow />
        
        <OrbitControls target={[center, 0, center]} maxPolarAngle={Math.PI / 2.1} />

        {/* Render Grid */}
        <group>
          {grid.map((row) =>
            row.map((tile) => (
              <AssetMesh 
                key={`${tile.x}-${tile.y}`} 
                tile={tile} 
                onClick={(e) => {
                    e.stopPropagation();
                    onTileClick(tile.x, tile.y);
                }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHovered({x: tile.x, y: tile.y});
                    document.body.style.cursor = 'pointer';
                }}
                onPointerOut={(e) => {
                     setHovered(null);
                     document.body.style.cursor = 'auto';
                }}
              />
            ))
          )}
        </group>

        {/* Selection Highlight */}
        {hovered && (
            <mesh position={[hovered.x, 0.02, hovered.y]} rotation={[-Math.PI/2, 0, 0]}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial color="white" opacity={0.3} transparent />
            </mesh>
        )}
      </Canvas>
    </div>
  );
};

export default GameCanvas;
