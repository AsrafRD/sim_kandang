'use client';

import { Canvas } from '@react-three/fiber';
import {
  Environment,
  OrbitControls,
  Sky,
} from '@react-three/drei';
import * as THREE from 'three';

import { FarmEnvironment } from './FarmEnvironment';
import { BarnMarker, BarnData } from './BarnMarker';

interface BarnSceneProps {
  barnsData: BarnData[];
}

export function BarnScene({
  barnsData,
}: BarnSceneProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-[#263629]/10 bg-[#F5F2E8] shadow-inner">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{
          position: [26, 22, 26],
          fov: 42,
          near: 0.1,
          far: 250,
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
      >
        {/* =====================================================
            BACKGROUND
        ===================================================== */}

        <color
          attach="background"
          args={['#F4F1E7']}
        />

        {/* =====================================================
            ATMOSPHERE
        ===================================================== */}

        <fog
          attach="fog"
          args={['#F4F1E7', 70, 150]}
        />

        {/* =====================================================
            AMBIENT LIGHT
        ===================================================== */}

        <ambientLight
          intensity={0.65}
          color="#F5F2E8"
        />

        {/* =====================================================
            MAIN SUN
        ===================================================== */}

        <directionalLight
          position={[20, 35, 15]}
          intensity={2}
          color="#FFF4D6"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
          shadow-camera-near={1}
          shadow-camera-far={120}
          shadow-bias={-0.0002}
        />

        {/* =====================================================
            SOFT FILL LIGHT
        ===================================================== */}

        <directionalLight
          position={[-20, 12, -20]}
          intensity={0.35}
          color="#CFE0C2"
        />

        {/* =====================================================
            SKY
        ===================================================== */}

        <Sky
          sunPosition={[20, 30, 15]}
          turbidity={4}
          rayleigh={1.2}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
        />

        {/* =====================================================
            HDR ENVIRONMENT
        ===================================================== */}

        <Environment
          preset="park"
          environmentIntensity={0.45}
        />

        {/* =====================================================
            FARM WORLD
        ===================================================== */}

        <FarmEnvironment />

        {/* =====================================================
            BARN MARKERS
        ===================================================== */}

        {barnsData.map((barn, index) => {
          /*
           * Keep the farm layout intentional.
           *
           * Instead of a perfect UI grid, slightly offset
           * the rows to make the world feel organic.
           */

          const columns = 3;

          const column = index % columns;
          const row = Math.floor(index / columns);

          const x =
            column * 13 -
            13 +
            (row % 2 === 0 ? 0 : 2);

          const z =
            row * 15 -
            7;

          return (
            <BarnMarker
              key={barn.id ?? index}
              position={[x, 0, z]}
              data={barn}
            />
          );
        })}

        {/* =====================================================
            CAMERA CONTROLS
        ===================================================== */}

        <OrbitControls
          makeDefault

          enablePan
          enableZoom
          enableRotate

          /*
           * Keep the camera above the farm.
           */

          minPolarAngle={Math.PI / 5}
          maxPolarAngle={Math.PI / 2.15}

          /*
           * Prevent the user from zooming too far away
           * or getting too close to individual objects.
           */

          minDistance={12}
          maxDistance={70}

          /*
           * Smooth camera movement.
           */

          enableDamping
          dampingFactor={0.08}

          /*
           * Slightly slower rotation feels more premium.
           */

          rotateSpeed={0.55}
          zoomSpeed={0.7}
          panSpeed={0.6}

          /*
           * Keep the farm centered.
           */

          target={[0, 0, 2]}
        />
      </Canvas>

      {/* =====================================================
          UI OVERLAY
      ===================================================== */}

      <div className="pointer-events-none absolute left-5 top-5">
        <div className="rounded-full border border-[#263629]/10 bg-[#F7F4EA]/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#58763A] shadow-sm backdrop-blur-md">
          Farm Overview
        </div>
      </div>

      {/* =====================================================
          LEGEND
      ===================================================== */}

      <div className="pointer-events-none absolute bottom-5 left-5">
        <div className="flex items-center gap-3 rounded-full border border-[#263629]/10 bg-[#F7F4EA]/85 px-3 py-2 text-[10px] text-[#6F766A] shadow-sm backdrop-blur-md">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#79A85B]" />
            Healthy
          </span>

          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D59A3A]" />
            Warning
          </span>

          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C65A4A]" />
            Attention
          </span>
        </div>
      </div>
    </div>
  );
}
