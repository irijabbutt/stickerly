"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function FloatingShape({
  position,
  color,
  geometry,
}: {
  position: [number, number, number];
  color: string;
  geometry: "box" | "sphere" | "torus";
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geom = useMemo(() => {
    switch (geometry) {
      case "sphere":
        return new THREE.SphereGeometry(0.6, 32, 32);
      case "torus":
        return new THREE.TorusGeometry(0.5, 0.2, 16, 64);
      default:
        return new THREE.BoxGeometry(1, 1, 1);
    }
  }, [geometry]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    meshRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
  });

  return (
    <mesh ref={meshRef} position={position} geometry={geom}>
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
    </mesh>
  );
}

export function FloatingStickers() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} className="rounded-3xl">
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#f472b6" />
      <FloatingShape position={[-1.5, 0.5, 0]} color="#8b5cf6" geometry="box" />
      <FloatingShape position={[1.2, -0.3, 0.5]} color="#f472b6" geometry="sphere" />
      <FloatingShape position={[0, 1.2, -0.5]} color="#34d399" geometry="torus" />
      <FloatingShape position={[-0.8, -1, 0.2]} color="#fbbf24" geometry="sphere" />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
    </Canvas>
  );
}
