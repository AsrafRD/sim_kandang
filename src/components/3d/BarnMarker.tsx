'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export function BarnMarker({ 
  position, 
  data, 
  onClick 
}: { 
  position: [number, number, number]; 
  data: any; 
  onClick?: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const targetY = hovered ? position[1] + 1 : position[1]; // Elevate when hovered
  
  // Smooth animation for hover
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        targetY,
        0.1
      );
      
      // Pulse animation for warning/danger
      if (data.healthStatus === 'danger' && !hovered) {
        meshRef.current.scale.y = 1 + Math.sin(Date.now() / 200) * 0.05;
      } else {
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1, 0.1);
      }
    }
  });

  // Colors based on health
  const getBarnColor = () => {
    if (data.healthStatus === 'danger') return '#C65A4A';
    if (data.healthStatus === 'warning') return '#D59A3A';
    return hovered ? '#8C6A45' : '#58763A';
  };

  return (
    <group 
      ref={meshRef} 
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      <mesh castShadow receiveShadow position={[0, 1, 0]}>
        {/* Simple Barn representation: A box with a triangle roof */}
        <boxGeometry args={[4, 2, 8]} />
        <meshStandardMaterial color={getBarnColor()} roughness={0.7} />
      </mesh>
        
      {/* Roof */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[3, 1.5, 4, 1, false, Math.PI / 4]} />
        <meshStandardMaterial color="#233629" roughness={0.9} />
      </mesh>

      {/* HTML Overlay Tooltip when hovered */}
      {hovered && (
        <Html position={[0, 4, 0]} center zIndexRange={[100, 0]}>
          <div className="bg-background border border-border shadow-2xl rounded-xl p-4 w-56 text-sm pointer-events-none transition-opacity">
            <h4 className="font-bold text-foreground border-b border-border pb-2 mb-2 whitespace-nowrap">{data.name}</h4>
            <div className="space-y-1.5">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground whitespace-nowrap">Livestock</span>
                <span className="font-medium text-foreground">{data.livestockCount}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground whitespace-nowrap">Mortality</span>
                <span className={`font-medium ${data.healthStatus === 'danger' ? 'text-destructive' : 'text-foreground'}`}>
                  {data.mortalityRate}%
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground whitespace-nowrap">Temp</span>
                <span className="font-medium text-foreground">{data.temperature}°C</span>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
