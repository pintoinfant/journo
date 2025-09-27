"use client";

import { usePathname } from "next/navigation";
import {
  Home,
  List,
  User,
  Award,
  X,
  GitGraphIcon,
  Clapperboard,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Float, Text } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// Simplified color palette
const genreColors: Record<string, string> = {
  Drama: "#ff6b6b",
  Crime: "#4ecdc4", 
  Action: "#ffe66d",
  Adventure: "#ff8b94",
  Comedy: "#95e1d3",
  Romance: "#fce38a",
  SciFi: "#6c5ce7",
  Thriller: "#fd79a8",
  Documentary: "#00b894",
  Animation: "#e17055",
};

const emotionColors: Record<string, string> = {
  happy: "#fdcb6e",
  sad: "#74b9ff", 
  excited: "#fd79a8",
  calm: "#00b894",
  angry: "#e17055",
  neutral: "#ddd",
};

const nodeTypeColors = {
  user: "#00ff88",
  movie: "#ff6b6b",
  genre: "#4ecdc4",
  person: "#fd79a8",
};

const glowColors = {
  user: "#00ff88",
  movie: "#ff4757",
  genre: "#2ed573",
  person: "#ff6b7a",
};

// Full Graph Component
function FullGraph() {
  const [graphData, setGraphData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cameraDistance, setCameraDistance] = useState(8);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/graph-data');
        const result = await response.json();
        
        if (result.success) {
          setGraphData(result.data);
        } else {
          setError(result.error || 'Failed to load graph data');
        }
      } catch (err) {
        setError('Network error while loading graph data');
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, []);

  const nodeMap = useMemo(() => 
    graphData ? Object.fromEntries(graphData.nodes.map((n: any) => [n.id, n.position])) : {}, 
    [graphData]
  );
  
  const expandedNode = useMemo(() => 
    graphData ? graphData.nodes.find((n: any) => n.id === expandedId) : null, 
    [graphData, expandedId]
  );
  
  const connections = useMemo(() => {
    if (!expandedNode || !graphData) return [];
    return graphData.edges.filter((e: any) => e.from === expandedNode.id || e.to === expandedNode.id).map((e: any) => {
      const otherId = e.from === expandedNode.id ? e.to : e.from;
      return graphData.nodes.find((n: any) => n.id === otherId);
    }).filter(Boolean);
  }, [expandedNode, graphData]);
  
  const handleNodeExpand = useCallback((nodeId: string) => {
    setExpandedId(expandedId === nodeId ? null : nodeId);
  }, [expandedId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
      </div>
    );
  }

  if (error || !graphData) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <div className="text-2xl mb-2">📊</div>
          <div className="text-sm">No data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        shadows
        className="touch-none"
      >
        <fog attach="fog" args={["#000000", 8, 20]} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#74b9ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.6} color="#fd79a8" />
        
        <CameraTracker setCameraDistance={setCameraDistance} />
        
        <Scene>
          {/* Edges */}
          {graphData.edges.map((edge: any, i: number) => {
            const from = nodeMap[edge.from] ?? [0, 0, 0];
            const to = nodeMap[edge.to] ?? [0, 0, 0];
            const isUserEdge = edge.from === "user" || edge.to === "user";
            return (
              <Edge
                key={i}
                from={from}
                to={to}
                color={edge.color}
                isUserEdge={isUserEdge}
              />
            );
          })}
          
          {/* Nodes */}
          {graphData.nodes.map((node: any) => (
            <Node
              key={node.id}
              node={node}
              expanded={expandedId === node.id}
              onExpand={() => handleNodeExpand(node.id)}
              cameraDistance={cameraDistance}
              modalOpen={!!expandedNode}
            />
          ))}
        </Scene>
        
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.6}
            intensity={1.0}
            radius={0.6}
          />
        </EffectComposer>
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={12}
          autoRotate={false}
          rotateSpeed={0.4}
          zoomSpeed={0.8}
          enableDamping={true}
          dampingFactor={0.05}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN,
          }}
        />
      </Canvas>
      
      {/* Clean Expanded node info panel */}
      {expandedNode && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-6 max-w-sm w-full mx-4 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: expandedNode.type === 'user' ? nodeTypeColors.user :
                                   expandedNode.type === 'genre' ? genreColors[expandedNode.label] : 
                                   expandedNode.type === 'person' ? emotionColors[expandedNode.emotion] : 
                                   nodeTypeColors.movie,
                  }}
                />
                <span className="text-xs uppercase tracking-wider text-gray-400 font-mono">
                  {expandedNode.type}
                </span>
              </div>
              <button
                onClick={() => setExpandedId(null)}
                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded"
              >
                ✕
              </button>
            </div>
            
            {/* Content */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {expandedNode.type === 'user' ? 'You are here' : expandedNode.label}
                </h3>
                
                {expandedNode.type === 'movie' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="font-semibold">{expandedNode.rating}</span>
                      </div>
                      <span className="text-gray-500">•</span>
                      <span className="font-mono">{expandedNode.year}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {expandedNode.genres.map((genre: string) => (
                        <span
                          key={genre}
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: genreColors[genre] + "20",
                            color: genreColors[genre],
                          }}
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {expandedNode.type === 'person' && (
                  <div className="text-sm text-gray-300">
                    <span className="capitalize font-medium">{expandedNode.emotion}</span>
                    <span className="text-gray-500"> • {expandedNode.age} years</span>
                  </div>
                )}
                
                {expandedNode.type === 'genre' && (
                  <div className="text-sm text-gray-300">
                    Connected to {connections.length} nodes
                  </div>
                )}
              </div>
              
              {connections.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                    Connected ({connections.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {connections.slice(0, 6).map((conn: any) => (
                      <span
                        key={conn.id}
                        className="px-2 py-1 rounded text-xs font-medium bg-gray-800 text-gray-300"
                      >
                        {conn.label}
                      </span>
                    ))}
                    {connections.length > 6 && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-gray-800 text-gray-500">
                        +{connections.length - 6}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Node({ node, expanded, onExpand, cameraDistance, modalOpen }: {
  node: any;
  expanded: boolean;
  onExpand: () => void;
  cameraDistance: number;
  modalOpen: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  let color = "#1a1a1a";
  let glowColor = "#444";
  let size = 0.06;
  
  if (node.type === "user") {
    color = "#ffffff";
    glowColor = glowColors.user;
    size = 0.12;
  } else if (node.type === "genre") {
    color = node.color;
    glowColor = glowColors.genre;
    size = 0.08;
  } else if (node.type === "person") {
    color = emotionColors[node.emotion];
    glowColor = glowColors.person;
    size = 0.05;
  } else if (node.type === "movie") {
    color = nodeTypeColors.movie;
    glowColor = glowColors.movie;
    size = 0.07;
  }
  
  const scale = expanded ? 2.2 : hovered ? 1.4 : 1;
  const glowScale = expanded ? 2.8 : hovered ? 1.8 : 1.2;
  
  const showLabel = !modalOpen && (
    node.type === "user" || 
    node.type === "genre" || 
    cameraDistance < 1.5 || 
    expanded
  );
  
  useFrame((state) => {
    if (meshRef.current && groupRef.current && glowRef.current) {
      const time = state.clock.getElapsedTime();
      
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, scale, 0.08));
      glowRef.current.scale.setScalar(THREE.MathUtils.lerp(glowRef.current.scale.x, glowScale, 0.05));
      
      const baseY = node.position[1];
      const baseX = node.position[0];
      const baseZ = node.position[2];
      
      if (node.type === "user") {
        groupRef.current.position.y = baseY + Math.sin(time * 0.8) * 0.06;
        groupRef.current.position.x = baseX + Math.sin(time * 0.5) * 0.02;
        meshRef.current.rotation.y = time * 0.2;
      } else if (node.type === "genre") {
        groupRef.current.position.y = baseY + Math.sin(time * 0.4 + baseX * 0.1) * 0.04;
        meshRef.current.rotation.y = time * 0.1;
      } else {
        groupRef.current.position.y = baseY + Math.sin(time * 0.6 + baseX * 0.2) * 0.03;
        meshRef.current.rotation.y = time * 0.08;
      }
      
      const glowIntensity = hovered ? 0.6 : 
                           expanded ? 0.5 : 
                           0.25;
      
      if (glowRef.current.material) {
        (glowRef.current.material as THREE.MeshBasicMaterial).opacity = glowIntensity * 0.25;
      }
    }
  });
  
  return (
    <group ref={groupRef} position={[node.position[0], node.position[1], node.position[2]]}>
      {/* Glow effect */}
      <mesh ref={glowRef}>
        {node.type === "user" ? (
          <octahedronGeometry args={[size * 1.5, 0]} />
        ) : node.type === "genre" ? (
          <boxGeometry args={[size * 2.2, size * 2.2, size * 2.2]} />
        ) : (
          <sphereGeometry args={[size * 1.8, 16, 16]} />
        )}
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Main node */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerLeave={() => setHovered(false)}
        onClick={(e) => { e.stopPropagation(); onExpand(); }}
      >
        {node.type === "user" ? (
          <octahedronGeometry args={[size, 0]} />
        ) : node.type === "genre" ? (
          <boxGeometry args={[size * 1.5, size * 1.5, size * 1.5]} />
        ) : (
          <sphereGeometry args={[size, 16, 16]} />
        )}
        
        <meshStandardMaterial
          color={color}
          emissive={glowColor}
          emissiveIntensity={
            node.type === "user" ? 0.6 : 
            expanded ? 0.5 : 
            hovered ? 0.4 : 
            node.type === "genre" ? 0.3 : 0.2
          }
          metalness={0.4}
          roughness={0.3}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Enhanced label with glow */}
      {showLabel && (
        <Html
          center
          distanceFactor={node.type === "user" ? 10 : node.type === "genre" ? 15 : 18}
          style={{
            pointerEvents: "none",
            userSelect: "none",
            fontSize: node.type === "user" ? "12px" : node.type === "genre" ? "11px" : "10px",
            fontWeight: node.type === "user" ? "700" : node.type === "genre" ? "600" : "500",
            color: "#ffffff",
            textShadow: `0 0 12px ${glowColor}, 0 0 20px ${glowColor}`,
            fontFamily: "system-ui, -apple-system, sans-serif",
            textAlign: "center",
            filter: hovered ? "brightness(1.2)" : "brightness(1)",
            transition: "filter 0.2s ease",
          }}
        >
          <div className="text-center">
            <div className={`tracking-wide ${node.type === "user" ? "text-sm" : "text-xs"}`}>
              {node.type === "user" ? "● YOU" : node.label}
            </div>
            {node.type === "movie" && cameraDistance < 1.5 && (
              <div className="text-xs opacity-90 mt-1 text-yellow-300">
                ★ {node.rating}
              </div>
            )}
            {node.type === "person" && cameraDistance < 1.5 && (
              <div className="text-xs opacity-80 mt-1 capitalize">
                {node.emotion}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

function Edge({ from, to, color, isUserEdge }: { 
  from: [number, number, number]; 
  to: [number, number, number]; 
  color: string;
  isUserEdge: boolean;
}) {
  const lineRef = useRef<THREE.Line>(null);
  const glowRef = useRef<THREE.Line>(null);
  
  useFrame((state) => {
    if (lineRef.current && glowRef.current) {
      const time = state.clock.getElapsedTime();
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      const glowMaterial = glowRef.current.material as THREE.LineBasicMaterial;
      
      if (isUserEdge) {
        material.opacity = 0.8 + Math.sin(time * 1.5) * 0.1;
        glowMaterial.opacity = 0.3 + Math.sin(time * 1) * 0.1;
      } else {
        material.opacity = 0.3 + Math.sin(time * 0.8 + from[0] * 0.1) * 0.05;
        glowMaterial.opacity = 0.1 + Math.sin(time * 0.6 + from[0] * 0.1) * 0.03;
      }
    }
  });
  
  return (
    <group>
      {/* Glow line */}
      <line ref={glowRef as any}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([...from, ...to]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={isUserEdge ? 0.4 : 0.15}
          linewidth={isUserEdge ? 6 : 3}
        />
      </line>
      
      {/* Main line */}
      <line ref={lineRef as any}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([...from, ...to]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={isUserEdge ? 0.8 : 0.3}
          linewidth={isUserEdge ? 3 : 1.5}
        />
      </line>
    </group>
  );
}

function Scene({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.rotation.y = time * 0.01;
    }
  });
  
  return (
    <Float speed={0.2} rotationIntensity={0.01} floatIntensity={0.03}>
      <group ref={groupRef}>
        {children}
      </group>
    </Float>
  );
}

function CameraTracker({ setCameraDistance }: { setCameraDistance: (d: number) => void }) {
  const { camera } = useThree();
  
  useFrame(() => {
    const distance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
    setCameraDistance(distance);
  });
  
  return null;
}

export default function BottomNav() {
  const pathname = usePathname();
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  const navItems = [
    { href: "/home", icon: Home, label: "Home" },
    { href: "/lists", icon: Clapperboard, label: "Movies" },
    { href: "/discover", icon: Award, label: "Explore" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  const toggleSlider = () => {
    setIsSliderOpen(!isSliderOpen);
  };

  return (
    <>
      {/* Dark Slider Overlay */}
      <AnimatePresence>
        {isSliderOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={toggleSlider}
            />

            {/* Dark Slider Panel */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-black rounded-t-3xl shadow-2xl"
              style={{ height: "70vh" }}
            >
              {/* Handle */}
              <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mt-3 mb-6" />

              {/* Content */}
                              <div className="h-full px-2 pb-6">
                  <div className="text-white text-center mb-4">
                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">
                      NEXUS NETWORK
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Your cinematic connections
                    </p>
                  </div>
                  <FullGraph />
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Enhanced Bottom Navigation with Central Menu */}
      <nav className="fixed bottom-0 left-0 right-0 z-40">
        <div className="mx-3 mb-4">
          <div className="bg-gradient-to-r from-amber-50/95 to-orange-50/95 backdrop-blur-xl border-2 border-amber-200/30 rounded-3xl shadow-2xl shadow-amber-400/20 overflow-hidden">
            <div className="flex items-center justify-between px-1 py-2">
              {/* Left Navigation Items */}
              <div className="flex flex-1 justify-around">
                {navItems.slice(0, 2).map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex flex-col items-center py-2 px-3 group relative"
                    >
                      <motion.div
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-400/40"
                            : "bg-transparent group-hover:bg-amber-100/50"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 transition-all duration-300 ${
                            isActive
                              ? "text-white"
                              : "text-amber-700 group-hover:text-amber-800"
                          }`}
                          strokeWidth={2}
                        />
                      </motion.div>
                      <span
                        className={`text-xs font-medium mt-1 transition-all duration-300 ${
                          isActive
                            ? "text-amber-800"
                            : "text-amber-600 group-hover:text-amber-700"
                        }`}
                      >
                        {item.label}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute -bottom-1 w-8 h-0.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"
                          transition={{
                            type: "spring",
                            damping: 30,
                            stiffness: 400,
                          }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Central Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={toggleSlider}
                className="flex flex-col items-center py-1 px-4 group relative"
              >
                <motion.div
                  animate={{
                    rotate: isSliderOpen ? 180 : 0,
                    scale: isSliderOpen ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3, type: "spring", damping: 20 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 shadow-xl shadow-orange-400/50 flex items-center justify-center group-hover:shadow-orange-500/60 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />

                  {isSliderOpen ? (
                    <X
                      className="w-7 h-7 text-white relative z-10"
                      strokeWidth={2.5}
                    />
                  ) : (
                    <GitGraphIcon
                      className="w-7 h-7 text-white relative z-10"
                      strokeWidth={2.5}
                    />
                  )}

                  {/* Animated ripple effect */}
                  <motion.div
                    animate={{
                      scale: isSliderOpen ? [1, 1.2, 1] : 1,
                      opacity: isSliderOpen ? [0.5, 0.2, 0.5] : 0.5,
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: isSliderOpen ? Infinity : 0,
                    }}
                    className="absolute inset-0 bg-white/20 rounded-2xl"
                  />
                </motion.div>
                <span className="text-xs font-semibold mt-1 text-orange-900 group-hover:text-orange-800 transition-colors">
                  {isSliderOpen ? "Close" : "K-Graph"}
                </span>
              </motion.button>

              {/* Right Navigation Items */}
              <div className="flex flex-1 justify-around">
                {navItems.slice(2, 4).map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex flex-col items-center py-2 px-3 group relative"
                    >
                      <motion.div
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-400/40"
                            : "bg-transparent group-hover:bg-amber-100/50"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 transition-all duration-300 ${
                            isActive
                              ? "text-white"
                              : "text-amber-700 group-hover:text-amber-800"
                          }`}
                          strokeWidth={2}
                        />
                      </motion.div>
                      <span
                        className={`text-xs font-medium mt-1 transition-all duration-300 ${
                          isActive
                            ? "text-amber-800"
                            : "text-amber-600 group-hover:text-amber-700"
                        }`}
                      >
                        {item.label}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute -bottom-1 w-8 h-0.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"
                          transition={{
                            type: "spring",
                            damping: 30,
                            stiffness: 400,
                          }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
