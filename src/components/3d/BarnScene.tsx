'use client';

import { Canvas } from '@react-three/fiber';
import {
  Environment,
  OrbitControls,
} from '@react-three/drei';

import * as THREE from 'three';

import {
  BarnInterior,
} from './BarnInterior';

interface BarnInteriorSceneProps {
  data: {
    name: string;
    livestockCount: number;
    temperature: number;
    humidity: number;
    feedLevel: number;
    healthStatus: 'healthy' | 'warning' | 'danger';
  };
}

export function BarnInteriorScene({
  data,
}: BarnInteriorSceneProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-[#263629]/10 bg-[#F4F1E7]">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{
          position: [20, 17, 20],
          fov: 42,
          near: 0.1,
          far: 150,
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
      >
        {/* Background */}

        <color
          attach="background"
          args={['#DCE2D2']}
        />

        {/* Fog */}

        <fog
          attach="fog"
          args={['#DCE2D2', 45, 110]}
        />

        {/* Ambient */}

        <ambientLight
          intensity={0.7}
          color="#F5F2E8"
        />

        {/* Main light */}

        <directionalLight
          position={[10, 25, 15]}
          intensity={2}
          color="#FFF0C7"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Cool fill */}

        <directionalLight
          position={[-15, 10, -10]}
          intensity={0.4}
          color="#C8D8C2"
        />

        <Environment
          preset="park"
          environmentIntensity={0.35}
        />

        {/* Interior */}

        <BarnInterior data={data} />

        {/* Controls */}

        <OrbitControls
          makeDefault
          enablePan
          enableZoom
          enableRotate
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.5}
          zoomSpeed={0.7}
          panSpeed={0.5}
          minDistance={10}
          maxDistance={55}
          minPolarAngle={Math.PI / 7}
          maxPolarAngle={Math.PI / 2.05}
          target={[0, 2.5, 0]}
        />
      </Canvas>

      {/* Header */}

      <div className="pointer-events-none absolute left-5 top-5">
        <div className="rounded-xl border border-white/50 bg-[#F7F4EA]/85 px-4 py-3 shadow-lg backdrop-blur-md">
          <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#7C8176]">
            Barn Interior
          </div>

          <div className="mt-1 text-sm font-bold text-[#263629]">
            {data.name}
          </div>
        </div>
      </div>

      {/* Metrics */}

      <div className="pointer-events-none absolute bottom-5 left-5 flex gap-2">
        <div className="rounded-xl border border-white/50 bg-[#F7F4EA]/85 px-3 py-2 shadow-md backdrop-blur-md">
          <div className="text-[9px] uppercase text-[#7C8176]">
            Temperature
          </div>

          <div className="text-sm font-bold text-[#263629]">
            {data.temperature}°C
          </div>
        </div>

        <div className="rounded-xl border border-white/50 bg-[#F7F4EA]/85 px-3 py-2 shadow-md backdrop-blur-md">
          <div className="text-[9px] uppercase text-[#7C8176]">
            Humidity
          </div>

          <div className="text-sm font-bold text-[#263629]">
            {data.humidity}%
          </div>
        </div>

        <div className="rounded-xl border border-white/50 bg-[#F7F4EA]/85 px-3 py-2 shadow-md backdrop-blur-md">
          <div className="text-[9px] uppercase text-[#7C8176]">
            Feed
          </div>

          <div className="text-sm font-bold text-[#263629]">
            {data.feedLevel}%
          </div>
        </div>
      </div>
    </div>
  );
}
