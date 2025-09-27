"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Text,
  Float,
  Sphere,
  Environment,
  Stars,
  useGLTF,
} from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

// Custom Red Carpet Model Component
function RedCarpetModel() {
  const carpetRef = useRef<THREE.Group>(null);

  // Load the GLB model
  const { scene } = useGLTF("/models/redcarpet.glb");

  // Clone the scene to avoid conflicts
  const clonedScene = scene.clone();

  useFrame((state) => {
    if (carpetRef.current) {
      // Optional: Add subtle rotation or movement
      carpetRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  // Debug logging
  console.log("RedCarpet model loaded:", clonedScene);

  return (
    <group ref={carpetRef}>
      {/* Test cube to verify positioning */}
      <mesh position={[0, -2, 0]}>
        <boxGeometry args={[2, 0.1, 4]} />
        <meshStandardMaterial color="#ff0000" wireframe />
      </mesh>

      {/* The actual model */}
      <primitive
        object={clonedScene}
        scale={[0.5, 0.5, 0.5]}
        position={[0, -3, 0]}
        rotation={[0, 0, 0]}
      />

      {/* Helper wireframe around model bounds */}
      <mesh position={[0, -3, 0]}>
        <boxGeometry args={[10, 2, 10]} />
        <meshBasicMaterial color="#00ff00" wireframe />
      </mesh>
    </group>
  );
}

// Fallback Red Carpet component (original geometry)
function RedCarpetFallback() {
  const carpetRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (carpetRef.current) {
      carpetRef.current.rotation.x = -Math.PI / 2;
    }
  });

  return (
    <group>
      {/* Main red carpet */}
      <mesh ref={carpetRef} position={[0, -2, 0]}>
        <planeGeometry args={[8, 20]} />
        <meshStandardMaterial color="#8b0000" />
      </mesh>

      {/* Carpet edges */}
      <mesh position={[4, -1.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, 20]} />
        <meshStandardMaterial color="#4a0000" />
      </mesh>
      <mesh position={[-4, -1.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, 20]} />
        <meshStandardMaterial color="#4a0000" />
      </mesh>

      {/* Golden ropes */}
      <mesh position={[4.5, -1.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 20]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>
      <mesh position={[-4.5, -1.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 20]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>
    </group>
  );
}

// Floating film reels
function FilmReel({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const reelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (reelRef.current) {
      reelRef.current.rotation.z += 0.01;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={reelRef} position={position} rotation={rotation}>
        <mesh>
          <cylinderGeometry args={[1, 1, 0.2, 32]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.8, 0.8, 0.25, 32]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 0.3, 16]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>
      </group>
    </Float>
  );
}

// Spotlight component
function Spotlight({
  position,
  target,
}: {
  position: [number, number, number];
  target: [number, number, number];
}) {
  return (
    <group>
      <spotLight
        position={position}
        intensity={2}
        angle={Math.PI / 6}
        penumbra={0.5}
        color="#ffffff"
        castShadow
        target-position={target}
      />
      <mesh position={position}>
        <coneGeometry args={[0.3, 1, 8]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
    </group>
  );
}

// Camera lights
function CameraLights() {
  const lightsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (lightsRef.current) {
      lightsRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={lightsRef}>
      <Spotlight position={[-6, 4, 5]} target={[0, 0, 0]} />
      <Spotlight position={[6, 4, 5]} target={[0, 0, 0]} />
      <Spotlight position={[0, 6, 8]} target={[0, 0, 0]} />
    </group>
  );
}

// Theater backdrop
function TheaterBackdrop() {
  return (
    <group>
      {/* Main stage */}
      <mesh position={[0, 0, -10]} rotation={[0, 0, 0]}>
        <planeGeometry args={[20, 12]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Curtains */}
      <mesh position={[-9, 0, -9.5]} rotation={[0, Math.PI / 6, 0]}>
        <planeGeometry args={[4, 12]} />
        <meshStandardMaterial color="#4a0000" />
      </mesh>
      <mesh position={[9, 0, -9.5]} rotation={[0, -Math.PI / 6, 0]}>
        <planeGeometry args={[4, 12]} />
        <meshStandardMaterial color="#4a0000" />
      </mesh>

      {/* Columns */}
      <mesh position={[-8, 0, -8]}>
        <cylinderGeometry args={[0.5, 0.5, 10]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>
      <mesh position={[8, 0, -8]}>
        <cylinderGeometry args={[0.5, 0.5, 10]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>
    </group>
  );
}

// Main 3D scene
function Scene3D() {
  const [cameraPosition, setCameraPosition] = useState<
    [number, number, number]
  >([0, 5, 15]);

  return (
    <Canvas shadows className="w-full h-full">
      <PerspectiveCamera makeDefault position={cameraPosition} />
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
        target={[0, 0, 0]}
      />

      {/* Environment */}
      <Environment preset="night" />
      <Stars
        radius={50}
        depth={50}
        count={1000}
        factor={4}
        saturation={0}
        fade
      />

      {/* Main scene elements */}
      <RedCarpetModel />
      <TheaterBackdrop />
      <CameraLights />

      {/* Floating film reels */}
      <FilmReel position={[-8, 3, 2]} rotation={[0, 0, 0]} />
      <FilmReel position={[8, 3, 2]} rotation={[0, 0, Math.PI / 4]} />
      <FilmReel position={[0, 5, -2]} rotation={[0, 0, Math.PI / 2]} />

      {/* Floating spheres for atmosphere */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere position={[-5, 4, 3]} args={[0.2]}>
          <meshStandardMaterial
            color="#ffd700"
            emissive="#ffd700"
            emissiveIntensity={0.5}
          />
        </Sphere>
      </Float>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <Sphere position={[5, 4, 3]} args={[0.2]}>
          <meshStandardMaterial
            color="#ffd700"
            emissive="#ffd700"
            emissiveIntensity={0.5}
          />
        </Sphere>
      </Float>

      {/* Main title */}
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <Text
          position={[0, 8, 0]}
          fontSize={1.5}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          journo
        </Text>
      </Float>

      {/* Subtitle */}
      <Float speed={0.3} rotationIntensity={0.05} floatIntensity={0.1}>
        <Text
          position={[0, 6, 0]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-regular.woff"
        >
          The Future of Film Rating
        </Text>
      </Float>

      {/* Enhanced lighting for better model visibility */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, 10, -5]} intensity={0.5} />
      <pointLight position={[0, 10, 0]} intensity={1} color="#ffffff" />
    </Canvas>
  );
}

// Main landing page component
export default function LandingPage3D() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Scene3D />
      </div>

      {/* Overlay content */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="flex flex-col items-center justify-center h-full">
          <AnimatePresence>
            {isLoaded && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-center pointer-events-auto"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="mt-16 space-y-4"
                >
                  <p className="text-lg text-gray-300 max-w-2xl mx-auto px-4">
                    Experience cinema like never before. Rate movies with
                    verified proof of viewing, powered by World ID verification
                    and blockchain technology.
                  </p>

                  <div className="flex gap-4 justify-center mt-8">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary px-8 py-3 text-lg"
                    >
                      Enter the Experience
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-secondary px-8 py-3 text-lg"
                    >
                      Learn More
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-3 bg-white rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

// Preload the GLB model
useGLTF.preload("/models/redcarpet.glb");
