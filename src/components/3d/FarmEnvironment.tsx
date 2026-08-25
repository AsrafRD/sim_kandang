'use client';

export function FarmEnvironment() {
  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#F4F1E7" roughness={1} />
      </mesh>
      
      {/* Grid Helper for visual scale */}
      <gridHelper args={[200, 100, '#E6E2D6', '#E6E2D6']} position={[0, -0.49, 0]} />

      {/* Ambient Trees / Fences Placeholder */}
      <mesh position={[-15, 1, -15]} castShadow>
        <cylinderGeometry args={[1, 1, 3, 8]} />
        <meshStandardMaterial color="#58763A" />
      </mesh>
      <mesh position={[15, 1, -20]} castShadow>
        <cylinderGeometry args={[1.5, 1.5, 4, 8]} />
        <meshStandardMaterial color="#263D28" />
      </mesh>
      <mesh position={[-20, 0.5, 10]} castShadow>
        <cylinderGeometry args={[1, 1, 2, 8]} />
        <meshStandardMaterial color="#7C8176" />
      </mesh>
    </group>
  );
}
