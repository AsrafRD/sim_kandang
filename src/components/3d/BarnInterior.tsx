'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type BarnInteriorData = {
  name: string;
  livestockCount: number;
  temperature: number;
  humidity: number;
  feedLevel: number;
  healthStatus: 'healthy' | 'warning' | 'danger';
};

interface BarnInteriorProps {
  data: BarnInteriorData;
}

/* ============================================================
   MATERIALS
============================================================ */

const COLORS = {
  floor: '#CFC7B4',
  wall: '#DED8C8',
  wallDark: '#BEB7A5',

  metal: '#68726C',
  metalDark: '#424A45',

  wood: '#8C6A45',

  feeder: '#D59A3A',
  drinker: '#6EA9B8',

  healthy: '#79A85B',
  warning: '#D59A3A',
  danger: '#C65A4A',

  animal: '#F0E9D8',
  animalDark: '#B9AF9A',
};

/* ============================================================
   FLOOR
============================================================ */

function BarnFloor() {
  return (
    <mesh
      receiveShadow
      position={[0, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[18, 36]} />

      <meshStandardMaterial
        color={COLORS.floor}
        roughness={0.95}
      />
    </mesh>
  );
}

/* ============================================================
   WALL
============================================================ */

function BarnWalls() {
  return (
    <group>
      {/* Left wall */}

      <mesh
        castShadow
        receiveShadow
        position={[-9, 3.5, 0]}
      >
        <boxGeometry args={[0.35, 7, 36]} />

        <meshStandardMaterial
          color={COLORS.wall}
          roughness={0.9}
        />
      </mesh>

      {/* Right wall */}

      <mesh
        castShadow
        receiveShadow
        position={[9, 3.5, 0]}
      >
        <boxGeometry args={[0.35, 7, 36]} />

        <meshStandardMaterial
          color={COLORS.wall}
          roughness={0.9}
        />
      </mesh>

      {/* Back wall */}

      <mesh
        castShadow
        receiveShadow
        position={[0, 3.5, -18]}
      >
        <boxGeometry args={[18, 7, 0.35]} />

        <meshStandardMaterial
          color={COLORS.wall}
          roughness={0.9}
        />
      </mesh>
    </group>
  );
}

/* ============================================================
   STRUCTURAL COLUMNS
============================================================ */

function BarnColumns() {
  const columns = [];

  for (let z = -15; z <= 15; z += 5) {
    columns.push(
      <group key={`left-${z}`}>
        <mesh
          castShadow
          position={[-8.3, 3.5, z]}
        >
          <boxGeometry args={[0.35, 7, 0.35]} />

          <meshStandardMaterial
            color={COLORS.metalDark}
            roughness={0.8}
          />
        </mesh>

        <mesh
          castShadow
          position={[8.3, 3.5, z]}
        >
          <boxGeometry args={[0.35, 7, 0.35]} />

          <meshStandardMaterial
            color={COLORS.metalDark}
            roughness={0.8}
          />
        </mesh>
      </group>
    );
  }

  return <group>{columns}</group>;
}

/* ============================================================
   ROOF FRAME
============================================================ */

function RoofStructure() {
  const beams = [];

  for (let z = -15; z <= 15; z += 5) {
    beams.push(
      <group key={z}>
        {/* Left beam */}

        <mesh
          castShadow
          position={[-4.5, 6.7, z]}
          rotation={[0, 0, -0.45]}
        >
          <boxGeometry args={[0.22, 9, 0.22]} />

          <meshStandardMaterial
            color={COLORS.metal}
            roughness={0.75}
          />
        </mesh>

        {/* Right beam */}

        <mesh
          castShadow
          position={[4.5, 6.7, z]}
          rotation={[0, 0, 0.45]}
        >
          <boxGeometry args={[0.22, 9, 0.22]} />

          <meshStandardMaterial
            color={COLORS.metal}
            roughness={0.75}
          />
        </mesh>
      </group>
    );
  }

  return <group>{beams}</group>;
}

/* ============================================================
   FEEDER LINE
============================================================ */

function FeederLine({
  z,
}: {
  z: number;
}) {
  return (
    <group position={[0, 1.25, z]}>
      {/* Main pipe */}

      <mesh castShadow>
        <cylinderGeometry
          args={[0.12, 0.12, 14, 12]}
        />

        <meshStandardMaterial
          color={COLORS.feeder}
          roughness={0.65}
        />
      </mesh>

      {/* Feed pans */}

      {[-5, -3, -1, 1, 3, 5].map((x) => (
        <mesh
          key={x}
          castShadow
          position={[x, -0.35, 0]}
        >
          <cylinderGeometry
            args={[0.45, 0.32, 0.18, 16]}
          />

          <meshStandardMaterial
            color={COLORS.feeder}
            roughness={0.75}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ============================================================
   DRINKER LINE
============================================================ */

function DrinkerLine({
  z,
}: {
  z: number;
}) {
  return (
    <group position={[0, 1.75, z]}>
      <mesh>
        <cylinderGeometry
          args={[0.08, 0.08, 14, 12]}
        />

        <meshStandardMaterial
          color={COLORS.drinker}
          roughness={0.45}
        />
      </mesh>

      {[-5, -3, -1, 1, 3, 5].map((x) => (
        <mesh
          key={x}
          position={[x, -0.28, 0]}
        >
          <cylinderGeometry
            args={[0.1, 0.1, 0.35, 12]}
          />

          <meshStandardMaterial
            color={COLORS.drinker}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ============================================================
   FAN
============================================================ */

function Fan({
  position,
}: {
  position: [number, number, number];
}) {
  const fanRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!fanRef.current) return;

    fanRef.current.rotation.z += delta * 2;
  });

  return (
    <group position={position}>
      {/* Fan housing */}

      <mesh
        castShadow
        rotation={[Math.PI / 2, 0, 0]}
        >
        <cylinderGeometry
            args={[1.2, 1.2, 0.35, 24]}
        />

        <meshStandardMaterial
            color={COLORS.metalDark}
            roughness={0.7}
        />
    </mesh>


      {/* Fan blades */}

      <group ref={fanRef}>
        {[0, 1, 2, 3].map((index) => (
          <mesh
            key={index}
            rotation={[
              0,
              0,
              (index * Math.PI) / 2,
            ]}
            position={[0, 0, 0.25]}
          >
            <boxGeometry args={[0.12, 1.5, 0.06]} />

            <meshStandardMaterial
              color="#AEB4AE"
              roughness={0.5}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ============================================================
   LIGHT
============================================================ */

function BarnLight({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry
          args={[0.35, 0.25, 0.2, 16]}
        />

        <meshStandardMaterial
          color="#E8D99C"
          emissive="#FFE8A3"
          emissiveIntensity={1.5}
        />
      </mesh>

      <pointLight
        color="#FFE7A3"
        intensity={1.2}
        distance={7}
      />
    </group>
  );
}

/* ============================================================
   LOW POLY ANIMAL
============================================================ */

function Animal({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* Body */}

      <mesh
        castShadow
        position={[0, 0.65, 0]}
      >
        <boxGeometry args={[0.7, 0.65, 1.15]} />

        <meshStandardMaterial
          color={COLORS.animal}
          roughness={0.9}
        />
      </mesh>

      {/* Head */}

      <mesh
        castShadow
        position={[0, 0.9, 0.65]}
      >
        <boxGeometry args={[0.48, 0.5, 0.5]} />

        <meshStandardMaterial
          color={COLORS.animal}
          roughness={0.9}
        />
      </mesh>

      {/* Legs */}

      {[
        [-0.22, 0.25, -0.3],
        [0.22, 0.25, -0.3],
        [-0.22, 0.25, 0.3],
        [0.22, 0.25, 0.3],
      ].map((leg, index) => (
        <mesh
          key={index}
          castShadow
          position={leg as [number, number, number]}
        >
          <boxGeometry args={[0.12, 0.5, 0.12]} />

          <meshStandardMaterial
            color={COLORS.animalDark}
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ============================================================
   LIVESTOCK GROUP
============================================================ */

function LivestockGroup() {
  const animals = useMemo(() => {
    const result: [number, number, number][] = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 8; col++) {
        result.push([
          -6 + col * 1.7,
          0,
          -11 + row * 5,
        ]);
      }
    }

    return result;
  }, []);

  return (
    <group>
      {animals.map((position, index) => (
        <Animal
          key={index}
          position={position}
        />
      ))}
    </group>
  );
}

/* ============================================================
   STATUS SENSOR
============================================================ */

function Sensor({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.18, 16, 16]} />

        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.8}
        />
      </mesh>

      <pointLight
        color={color}
        intensity={0.8}
        distance={4}
      />
    </group>
  );
}

/* ============================================================
   MAIN BARN
============================================================ */

export function BarnInterior({
  data,
}: BarnInteriorProps) {
  const statusColor =
    data.healthStatus === 'danger'
      ? COLORS.danger
      : data.healthStatus === 'warning'
        ? COLORS.warning
        : COLORS.healthy;

  return (
    <group>
      <BarnFloor />

      <BarnWalls />

      <BarnColumns />

      <RoofStructure />

      {/* Feed systems */}

      <FeederLine z={-5} />
      <FeederLine z={5} />

      {/* Drinking systems */}

      <DrinkerLine z={-2.5} />
      <DrinkerLine z={2.5} />

      {/* Fans */}

      <Fan position={[-8.2, 4.3, -10]} />
      <Fan position={[8.2, 4.3, -10]} />

      <Fan position={[-8.2, 4.3, 10]} />
      <Fan position={[8.2, 4.3, 10]} />

      {/* Lights */}

      <BarnLight position={[-4, 6.2, -10]} />
      <BarnLight position={[4, 6.2, -10]} />

      <BarnLight position={[-4, 6.2, 0]} />
      <BarnLight position={[4, 6.2, 0]} />

      <BarnLight position={[-4, 6.2, 10]} />
      <BarnLight position={[4, 6.2, 10]} />

      {/* Livestock */}

      <LivestockGroup />

      {/* Temperature / health sensors */}

      <Sensor
        position={[0, 4.5, -15]}
        color={statusColor}
      />

      <Sensor
        position={[0, 4.5, 15]}
        color={statusColor}
      />
    </group>
  );
}
