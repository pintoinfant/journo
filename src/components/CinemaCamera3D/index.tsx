"use client";

import React, { useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

// Error Boundary Component
class CameraErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("CinemaCamera Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackCamera />;
    }

    return this.props.children;
  }
}

// Simplified Cinema Camera Model Component with Full Slow Rotation
function CinemaCamera() {
  const cameraRef = useRef<THREE.Group>(null);
  const [error, setError] = useState<string | null>(null);

  // Use useGLTF hook at top level - it handles errors internally
  const gltf = useGLTF("/models/cinema_camera.glb");

  // Handle the case where the model might not load properly
  if (!gltf || !gltf.scene) {
    return <FallbackCamera />;
  }

  const clonedScene = gltf.scene.clone();

  useFrame((state) => {
    if (cameraRef.current) {
      // Simple, smooth, slow full rotation around Y-axis
      cameraRef.current.rotation.y = state.clock.elapsedTime * 0.15;

      // Extremely subtle floating effect
      cameraRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.2) * 0.01;
    }
  });

  if (error) {
    return <FallbackCamera />;
  }

  return (
    <Float speed={10} rotationIntensity={0} floatIntensity={0.1}>
      <group ref={cameraRef}>
        <primitive
          object={clonedScene}
          scale={[0.8, 0.8, 0.8]}
          position={[0, -0.2, 0]}
          rotation={[0, 0, 0]}
          castShadow
          receiveShadow
        />
      </group>
    </Float>
  );
}

// Simple fallback camera with slow rotation
function FallbackCamera() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Same slow rotation for fallback
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      meshRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.2) * 0.01;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[1.2, 0.8, 1.6]} />
        <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.8]} />
        <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Cinematic Key Light (Main dramatic light)
function KeyLight() {
  return (
    <directionalLight
      position={[6, 8, 4]}
      intensity={8}
      color="#fff8e1"
      castShadow
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-far={50}
      shadow-camera-left={-10}
      shadow-camera-right={10}
      shadow-camera-top={10}
      shadow-camera-bottom={-10}
    />
  );
}

// Fill Light (Softer secondary light)
function FillLight() {
  return (
    <directionalLight position={[-4, 6, 3]} intensity={6} color="#b3d9ff" />
  );
}

// Rim Light (Edge lighting for dramatic silhouette)
function RimLight() {
  return (
    <directionalLight position={[0, 4, -6]} intensity={8} color="#ffd700" />
  );
}

// Static Spotlight for dramatic effect
function DramaticSpotlight() {
  return (
    <spotLight
      position={[3, 6, 3]}
      angle={Math.PI / 6}
      penumbra={0.4}
      intensity={12}
      color="#ffcc80"
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      target-position={[0, 0, 0]}
    />
  );
}

// Accent Lights for atmosphere
function AccentLights() {
  return (
    <>
      {/* Warm accent light */}
      <pointLight
        position={[2, 3, 2]}
        intensity={8}
        color="#ff8a50"
        distance={8}
        decay={2}
      />

      {/* Cool accent light */}
      <pointLight
        position={[-2, 2, 1]}
        intensity={8}
        color="#50a3ff"
        distance={6}
        decay={2}
      />

      {/* Background glow */}
      <pointLight
        position={[0, 1, -4]}
        intensity={10}
        color="#ffd700"
        distance={12}
        decay={1.5}
      />
    </>
  );
}

// Atmospheric particles for cinematic feel
function AtmosphericParticles() {
  const particlesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={particlesRef}>
      {[...Array(12)].map((_, i) => (
        <Float
          key={i}
          speed={0.8 + i * 0.1}
          rotationIntensity={0.3}
          floatIntensity={0.4}
        >
          <mesh
            position={[
              Math.cos((i * Math.PI * 2) / 12) * (3 + Math.random() * 2),
              Math.sin(i * 0.8) * 2 + Math.random() * 1,
              Math.sin((i * Math.PI * 2) / 12) * (3 + Math.random() * 2),
            ]}
          >
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial
              color="#ffd700"
              emissive="#ffa500"
              emissiveIntensity={0.6}
              transparent
              opacity={0.8}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Simplified loading component
function LoadingCamera() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 0.6, 1.2]} />
        <meshStandardMaterial color="#333" wireframe />
      </mesh>
    </group>
  );
}

// Enhanced 3D scene with cinematic lighting
function CinemaScene() {
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    const handleContextLost = () => {
      console.warn("WebGL context lost");
      setContextLost(true);
    };

    const handleContextRestored = () => {
      console.log("WebGL context restored");
      setContextLost(false);
    };

    // Add event listeners for context loss
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.addEventListener("webglcontextlost", handleContextLost);
      canvas.addEventListener("webglcontextrestored", handleContextRestored);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("webglcontextlost", handleContextLost);
        canvas.removeEventListener(
          "webglcontextrestored",
          handleContextRestored
        );
      }
    };
  }, []);

  if (contextLost) {
    return <LoadingCamera />;
  }

  return (
    <>
      {/* Cinematic Lighting Setup */}
      <KeyLight />
      <FillLight />
      <RimLight />
      <DramaticSpotlight />
      <AccentLights />

      {/* Ambient lighting for base illumination */}
      <ambientLight intensity={1.5} color="#404040" />

      {/* Main camera model */}
      <Suspense fallback={<LoadingCamera />}>
        <CameraErrorBoundary>
          <CinemaCamera />
        </CameraErrorBoundary>
      </Suspense>

      {/* Atmospheric particles */}
      <AtmosphericParticles />

      {/* Ground plane for shadows and reflections */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.5, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.8}
          metalness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Background atmosphere */}
      <fog attach="fog" args={["#2a2a2a", 8, 20]} />
    </>
  );
}

// Main component with error boundary
export default function CinemaCamera3D() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Monitor for potential errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (
        event.message?.includes("WebGL") ||
        event.message?.includes("THREE")
      ) {
        console.error("WebGL/Three.js Error:", event.error);
        setHasError(true);
      }
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <motion.div className="relative w-full h-full">
        <div className="w-full h-full bg-gradient-to-br from-amber-200/20 to-orange-300/20 rounded-2xl flex items-center justify-center border-2 border-amber-200/30">
          <div className="text-center">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-amber-800 font-medium">Cinema Camera</p>
            <p className="text-amber-600 text-sm">3D view unavailable</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div>
      <Canvas
        className="w-full h-full rounded-2xl -mt-40"
        style={{
          width: "400px",
          height: "400px",
        }}
        shadows
        gl={{
          alpha: true,
          antialias: true, // Re-enabled for better quality
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false,
        }}
        camera={{ position: [10, 0, 10], fov: 3 }}
        performance={{ min: 0.5 }}
      >
        <CinemaScene />
      </Canvas>
    </motion.div>
  );
}

// Preload the cinema camera model
useGLTF.preload("/models/cinema_camera.glb");
