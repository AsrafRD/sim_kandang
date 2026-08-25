'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Sky } from '@react-three/drei';
import { FarmEnvironment } from './FarmEnvironment';
import { BarnMarker } from './BarnMarker';

export function BarnScene({ barnsData }: { barnsData: any[] }) {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-border shadow-inner bg-[#F5F2E8]">
      <Canvas shadows camera={{ position: [20, 15, 20], fov: 45 }}>
        {/* Lighting setup for Warm / Organic aesthetic */}
        <ambientLight intensity={0.4} color="#F5F2E8" />
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize={1024}
          color="#FDFBF7"
        />
        
        <Sky sunPosition={[10, 20, 10]} turbidity={0.3} rayleigh={0.5} />
        <Environment preset="park" />
        
        <FarmEnvironment />
        
        {/* Map barns data to 3D markers */}
        {barnsData.map((barn, idx) => {
          // Layout barns in a grid for demonstration (spacing of 12 on X, 15 on Z)
          const columns = 3;
          const x = (idx % columns) * 12 - 12;
          const z = Math.floor(idx / columns) * 15 - 5;
          
          return (
            <BarnMarker 
              key={barn.id} 
              position={[x, 0, z]} 
              data={barn} 
            />
          );
        })}
        
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera from going under ground
          minDistance={10}
          maxDistance={80}
        />
      </Canvas>
    </div>
  );
}
