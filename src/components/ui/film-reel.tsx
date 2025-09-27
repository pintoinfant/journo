"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Cylinder, Torus, Box } from "@react-three/drei";
import type * as THREE from "three";

interface FilmReelProps {
  position?: [number, number, number];
  scale?: number;
}

export default function FilmReel({
  position = [0, 0, 0],
  scale = 1,
}: FilmReelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.008;
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Main Reel - Mobile optimized */}
      <Cylinder args={[1.5, 1.5, 0.25, 16]}>
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
      </Cylinder>

      {/* Center Hub */}
      <Cylinder args={[0.4, 0.4, 0.3, 12]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </Cylinder>

      {/* Film Strip */}
      <Torus args={[1.35, 0.08, 6, 16]} position={[0, 0, 0.15]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Torus>

      {/* Spokes - Reduced count for mobile */}
      {Array.from({ length: 4 }, (_, i) => (
        <Box
          key={i}
          args={[0.04, 1.2, 0.04]}
          position={[
            Math.cos((i * Math.PI) / 2) * 0.6,
            Math.sin((i * Math.PI) / 2) * 0.6,
            0,
          ]}
          rotation={[0, 0, (i * Math.PI) / 2]}
        >
          <meshStandardMaterial
            color="#d4af37"
            metalness={0.8}
            roughness={0.2}
          />
        </Box>
      ))}

      {/* Film perforations - Simplified for mobile */}
      {Array.from({ length: 16 }, (_, i) => (
        <Box
          key={`perf-${i}`}
          args={[0.08, 0.04, 0.015]}
          position={[
            Math.cos((i * Math.PI) / 8) * 1.4,
            Math.sin((i * Math.PI) / 8) * 1.4,
            0.2,
          ]}
        >
          <meshStandardMaterial color="#333" />
        </Box>
      ))}
    </group>
  );
}
