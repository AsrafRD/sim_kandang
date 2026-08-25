'use client';

import { useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type BarnHealthStatus = 'healthy' | 'warning' | 'danger';

export type BarnData = {
  id?: string;
  name: string;
  livestockCount: number;
  mortalityRate: number;
  temperature: number;
  healthStatus: BarnHealthStatus;
};

interface BarnMarkerProps {
  position: [number, number, number];
  data: BarnData;
  onClick?: () => void;
}

const COLORS = {
  barn: '#58763A',
  barnHover: '#6F8F4C',
  barnSide: '#4A6532',

  roof: '#263D28',
  roofHighlight: '#304A31',

  wood: '#8C6A45',
  foundation: '#D8D1BE',

  healthy: '#79A85B',
  warning: '#D59A3A',
  danger: '#C65A4A',

  shadow: '#263D28',
};

function getStatusColor(status: BarnHealthStatus) {
  switch (status) {
    case 'danger':
      return COLORS.danger;
    case 'warning':
      return COLORS.warning;
    default:
      return COLORS.healthy;
  }
}

function getStatusLabel(status: BarnHealthStatus) {
  switch (status) {
    case 'danger':
      return 'Needs attention';
    case 'warning':
      return 'Monitor';
    default:
      return 'Healthy';
  }
}

export function BarnMarker({
  position,
  data,
  onClick,
}: BarnMarkerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const beaconLightRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const [hovered, setHovered] = useState(false);

  const statusColor = getStatusColor(data.healthStatus);
  const statusLabel = getStatusLabel(data.healthStatus);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;

    const time = clock.getElapsedTime();

    // --------------------------------------------------
    // Hover elevation
    // --------------------------------------------------

    const targetY = hovered ? position[1] + 0.35 : position[1];

    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      targetY,
      6,
      delta
    );

    // --------------------------------------------------
    // Hover scale
    // --------------------------------------------------

    const targetScale = hovered ? 1.045 : 1;

    const nextScale = THREE.MathUtils.damp(
      groupRef.current.scale.x,
      targetScale,
      6,
      delta
    );

    groupRef.current.scale.setScalar(nextScale);

    // --------------------------------------------------
    // Status beacon animation
    // --------------------------------------------------

    if (beaconRef.current) {
      const pulse =
        data.healthStatus === 'danger'
          ? 1 + Math.sin(time * 5) * 0.12
          : data.healthStatus === 'warning'
            ? 1 + Math.sin(time * 3) * 0.06
            : 1;

      beaconRef.current.scale.setScalar(pulse);
    }

    // --------------------------------------------------
    // Beacon glow
    // --------------------------------------------------

    if (beaconLightRef.current) {
      const pulse =
        data.healthStatus === 'danger'
          ? 0.8 + Math.sin(time * 5) * 0.2
          : data.healthStatus === 'warning'
            ? 0.85 + Math.sin(time * 3) * 0.1
            : 0.9;

      const material = beaconLightRef.current
        .material as THREE.MeshStandardMaterial;

      material.opacity = pulse;
    }

    // --------------------------------------------------
    // Ground ring
    // --------------------------------------------------

    if (ringRef.current) {
      const targetRingScale = hovered ? 1.08 : 1;

      const ringScale = THREE.MathUtils.damp(
        ringRef.current.scale.x,
        targetRingScale,
        6,
        delta
      );

      ringRef.current.scale.set(ringScale, 1, ringScale);
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
    >
      {/* =====================================================
          GROUND SHADOW
      ===================================================== */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.025, 0]}
        receiveShadow
      >
        <circleGeometry args={[3.25, 48]} />

        <meshBasicMaterial
          color={COLORS.shadow}
          transparent
          opacity={hovered ? 0.16 : 0.1}
          depthWrite={false}
        />
      </mesh>

      {/* =====================================================
          INTERACTION RING
      ===================================================== */}

      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.04, 0]}
      >
        <ringGeometry args={[2.7, 2.78, 64]} />

        <meshBasicMaterial
          color={statusColor}
          transparent
          opacity={hovered ? 0.8 : 0.35}
          depthWrite={false}
        />
      </mesh>

      {/* =====================================================
          FOUNDATION
      ===================================================== */}

      <mesh
        castShadow
        receiveShadow
        position={[0, 0.3, 0]}
      >
        <boxGeometry args={[4.4, 0.35, 8.4]} />

        <meshStandardMaterial
          color={COLORS.foundation}
          roughness={0.9}
        />
      </mesh>

      {/* =====================================================
          BARN BODY
      ===================================================== */}

      <mesh
        castShadow
        receiveShadow
        position={[0, 1.45, 0]}
      >
        <boxGeometry args={[4, 2.25, 8]} />

        <meshStandardMaterial
          color={hovered ? COLORS.barnHover : COLORS.barn}
          roughness={0.78}
        />
      </mesh>

      {/* =====================================================
          BARN SIDE ACCENT
      ===================================================== */}

      <mesh
        castShadow
        position={[2.01, 1.45, 0]}
      >
        <boxGeometry args={[0.08, 2.1, 7.6]} />

        <meshStandardMaterial
          color={COLORS.barnSide}
          roughness={0.9}
        />
      </mesh>

      {/* =====================================================
          ROOF
      ===================================================== */}

      <mesh
        castShadow
        receiveShadow
        position={[0, 3.05, 0]}
        rotation={[0, Math.PI / 4, 0]}
      >
        <coneGeometry
          args={[3.15, 1.75, 4, 1]}
        />

        <meshStandardMaterial
          color={hovered ? COLORS.roofHighlight : COLORS.roof}
          roughness={0.82}
        />
      </mesh>

      {/* =====================================================
          FRONT DOOR
      ===================================================== */}

      <mesh
        castShadow
        position={[0, 1.25, 4.04]}
      >
        <boxGeometry args={[1.5, 1.75, 0.12]} />

        <meshStandardMaterial
          color={COLORS.wood}
          roughness={0.85}
        />
      </mesh>

      {/* =====================================================
          DOOR CROSS
      ===================================================== */}

      <mesh
        position={[0, 1.25, 4.12]}
        rotation={[0, 0, Math.PI / 4]}
      >
        <boxGeometry args={[1.7, 0.08, 0.05]} />

        <meshStandardMaterial
          color="#6F5237"
          roughness={0.9}
        />
      </mesh>

      <mesh
        position={[0, 1.25, 4.13]}
        rotation={[0, 0, -Math.PI / 4]}
      >
        <boxGeometry args={[1.7, 0.08, 0.05]} />

        <meshStandardMaterial
          color="#6F5237"
          roughness={0.9}
        />
      </mesh>

      {/* =====================================================
          WINDOWS
      ===================================================== */}

      <mesh
        castShadow
        position={[-1.05, 1.65, 4.04]}
      >
        <boxGeometry args={[0.8, 0.7, 0.1]} />

        <meshStandardMaterial
          color="#B8D6B0"
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>

      <mesh
        castShadow
        position={[1.05, 1.65, 4.04]}
      >
        <boxGeometry args={[0.8, 0.7, 0.1]} />

        <meshStandardMaterial
          color="#B8D6B0"
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>

      {/* =====================================================
          STATUS BEACON
      ===================================================== */}

      <mesh
        ref={beaconRef}
        castShadow
        position={[0, 4.15, 0]}
      >
        <sphereGeometry args={[0.18, 24, 24]} />

        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={
            data.healthStatus === 'danger'
              ? 1.8
              : data.healthStatus === 'warning'
                ? 1.2
                : 0.8
          }
          roughness={0.3}
        />
      </mesh>

      {/* =====================================================
          BEACON GLOW
      ===================================================== */}

      <mesh
        ref={beaconLightRef}
        position={[0, 4.15, 0]}
      >
        <sphereGeometry args={[0.34, 24, 24]} />

        <meshBasicMaterial
          color={statusColor}
          transparent
          opacity={0.25}
          depthWrite={false}
        />
      </mesh>

      {/* =====================================================
          STATUS CONNECTOR
      ===================================================== */}

      <mesh position={[0, 3.65, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.75, 12]} />

        <meshBasicMaterial
          color={statusColor}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* =====================================================
          HOVER TOOLTIP
      ===================================================== */}

      {hovered && (
        <Html
          position={[0, 4.75, 0]}
          center
          distanceFactor={10}
          zIndexRange={[100, 0]}
          style={{
            pointerEvents: 'none',
          }}
        >
          <div className="w-64 rounded-2xl border border-white/20 bg-[#F7F4EA]/95 p-4 text-[#263629] shadow-2xl backdrop-blur-md">
            {/* Header */}

            <div className="mb-3 flex items-start justify-between gap-3 border-b border-[#263629]/10 pb-3">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6F766A]">
                  Barn
                </div>

                <h4 className="mt-0.5 text-sm font-bold">
                  {data.name}
                </h4>
              </div>

              <div
                className="flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold"
                style={{
                  backgroundColor: `${statusColor}18`,
                  color: statusColor,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: statusColor,
                  }}
                />

                {statusLabel}
              </div>
            </div>

            {/* Metrics */}

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-[#263629]/[0.05] p-2.5">
                <div className="text-[9px] uppercase tracking-wide text-[#7C8176]">
                  Livestock
                </div>

                <div className="mt-1 text-base font-bold">
                  {data.livestockCount}
                </div>
              </div>

              <div className="rounded-xl bg-[#263629]/[0.05] p-2.5">
                <div className="text-[9px] uppercase tracking-wide text-[#7C8176]">
                  Temp
                </div>

                <div className="mt-1 text-base font-bold">
                  {data.temperature}°
                </div>
              </div>

              <div className="rounded-xl bg-[#263629]/[0.05] p-2.5">
                <div className="text-[9px] uppercase tracking-wide text-[#7C8176]">
                  Mortality
                </div>

                <div
                  className="mt-1 text-base font-bold"
                  style={{
                    color:
                      data.healthStatus === 'danger'
                        ? COLORS.danger
                        : undefined,
                  }}
                >
                  {data.mortalityRate}%
                </div>
              </div>
            </div>

            {/* Footer */}

            <div className="mt-3 text-[10px] text-[#7C8176]">
              Click to view barn details
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
