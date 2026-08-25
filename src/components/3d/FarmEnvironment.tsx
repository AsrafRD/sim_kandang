'use client';

import * as THREE from 'three';

function Tree({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh castShadow position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.28, 0.38, 2.4, 8]} />
        <meshStandardMaterial
          color="#765638"
          roughness={1}
        />
      </mesh>

      {/* Lower foliage */}
      <mesh castShadow position={[0, 2.8, 0]}>
        <dodecahedronGeometry args={[1.45, 1]} />
        <meshStandardMaterial
          color="#58763A"
          roughness={0.95}
        />
      </mesh>

      {/* Upper foliage */}
      <mesh castShadow position={[0.25, 3.65, 0]}>
        <dodecahedronGeometry args={[1.05, 1]} />
        <meshStandardMaterial
          color="#6F8F4C"
          roughness={0.95}
        />
      </mesh>
    </group>
  );
}

function Fence({
  start,
  end,
}: {
  start: [number, number, number];
  end: [number, number, number];
}) {
  const startVector = new THREE.Vector3(...start);
  const endVector = new THREE.Vector3(...end);

  const midpoint = startVector.clone().add(endVector).multiplyScalar(0.5);

  const length = startVector.distanceTo(endVector);

  const angle = Math.atan2(
    endVector.z - startVector.z,
    endVector.x - startVector.x
  );

  return (
    <group
      position={[midpoint.x, midpoint.y, midpoint.z]}
      rotation={[0, -angle, 0]}
    >
      {/* Horizontal rails */}

      <mesh castShadow position={[0, 0.8, 0]}>
        <boxGeometry args={[length, 0.12, 0.12]} />

        <meshStandardMaterial
          color="#9B805F"
          roughness={0.95}
        />
      </mesh>

      <mesh castShadow position={[0, 1.45, 0]}>
        <boxGeometry args={[length, 0.12, 0.12]} />

        <meshStandardMaterial
          color="#9B805F"
          roughness={0.95}
        />
      </mesh>

      {/* Fence posts */}

      {Array.from({
        length: Math.max(2, Math.floor(length / 3)),
      }).map((_, index) => {
        const x =
          -length / 2 +
          (index / Math.max(1, Math.floor(length / 3) - 1)) *
            length;

        return (
          <mesh
            key={index}
            castShadow
            position={[x, 0.8, 0]}
          >
            <boxGeometry args={[0.16, 1.8, 0.16]} />

            <meshStandardMaterial
              color="#765638"
              roughness={1}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function FarmPath({
  position,
  size,
  rotation = 0,
}: {
  position: [number, number, number];
  size: [number, number];
  rotation?: number;
}) {
  return (
    <mesh
      position={[position[0], -0.44, position[2]]}
      rotation={[-Math.PI / 2, 0, rotation]}
      receiveShadow
    >
      <planeGeometry args={size} />

      <meshStandardMaterial
        color="#D9CCAF"
        roughness={1}
      />
    </mesh>
  );
}

export function FarmEnvironment() {
  return (
    <group>
      {/* =====================================================
          MAIN GROUND
      ===================================================== */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.5, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />

        <meshStandardMaterial
          color="#F4F1E7"
          roughness={1}
        />
      </mesh>

      {/* =====================================================
          SUBTLE FARM PATHS
      ===================================================== */}

      <FarmPath
        position={[0, 0, 8]}
        size={[60, 5]}
      />

      <FarmPath
        position={[0, 0, -8]}
        size={[60, 5]}
      />

      <FarmPath
        position={[-6, 0, 0]}
        size={[5, 60]}
      />

      <FarmPath
        position={[18, 0, 0]}
        size={[4, 60]}
      />

      {/* =====================================================
          FARM PLOTS
      ===================================================== */}

      <mesh
        position={[-27, -0.43, -8]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[24, 18]} />

        <meshStandardMaterial
          color="#DDE3C8"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[30, -0.43, 10]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 22]} />

        <meshStandardMaterial
          color="#E3E7D4"
          roughness={1}
        />
      </mesh>

      {/* =====================================================
          TREES
      ===================================================== */}

      <Tree
        position={[-18, -0.5, -15]}
        scale={1.15}
      />

      <Tree
        position={[-27, -0.5, -20]}
        scale={0.8}
      />

      <Tree
        position={[25, -0.5, -18]}
        scale={1.25}
      />

      <Tree
        position={[34, -0.5, -8]}
        scale={0.85}
      />

      <Tree
        position={[-24, -0.5, 18]}
        scale={1.1}
      />

      <Tree
        position={[28, -0.5, 22]}
        scale={1.15}
      />

      {/* =====================================================
          FENCES
      ===================================================== */}

      <Fence
        start={[-25, -0.5, 10]}
        end={[-25, -0.5, 28]}
      />

      <Fence
        start={[25, -0.5, 10]}
        end={[25, -0.5, 28]}
      />

      {/* =====================================================
          SMALL WATER TANK
      ===================================================== */}

      <group position={[22, -0.5, -13]}>
        <mesh
          castShadow
          position={[0, 1.6, 0]}
        >
          <cylinderGeometry args={[1.4, 1.4, 3.2, 16]} />

          <meshStandardMaterial
            color="#9A8A6C"
            roughness={0.85}
          />
        </mesh>

        <mesh
          position={[0, 3.25, 0]}
        >
          <cylinderGeometry args={[1.5, 1.5, 0.25, 16]} />

          <meshStandardMaterial
            color="#263D28"
            roughness={0.8}
          />
        </mesh>

        <mesh
          position={[0, 3.42, 0]}
        >
          <cylinderGeometry args={[1.1, 1.1, 0.05, 32]} />

          <meshStandardMaterial
            color="#87B8C7"
            roughness={0.2}
            metalness={0.05}
          />
        </mesh>
      </group>
    </group>
  );
}
