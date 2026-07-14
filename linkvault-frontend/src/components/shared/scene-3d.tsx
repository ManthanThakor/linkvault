"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial } from "@react-three/drei"
import type { Mesh } from "three"

function FloatingShape({ position, color, speed = 1, distort = 0.3, shape = "sphere" }: {
  position: [number, number, number]
  color: string
  speed?: number
  distort?: number
  shape?: "sphere" | "torus" | "icosahedron"
}) {
  const meshRef = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = clock.getElapsedTime() * 0.1 * speed
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.15 * speed
  })

  const props = { ref: meshRef, position, scale: 1.5 }
  const material = (
    <MeshDistortMaterial
      color={color}
      transparent
      opacity={0.15}
      roughness={0.5}
      metalness={0.8}
      distort={distort}
      speed={speed * 0.5}
    />
  )

  return (
    <Float speed={speed * 0.3} rotationIntensity={0.2} floatIntensity={0.5}>
      {shape === "sphere" && <mesh {...props}><sphereGeometry args={[1, 32, 32]} />{material}</mesh>}
      {shape === "torus" && <mesh {...props}><torusGeometry args={[0.8, 0.3, 16, 32]} />{material}</mesh>}
      {shape === "icosahedron" && <mesh {...props}><icosahedronGeometry args={[1, 0]} />{material}</mesh>}
    </Float>
  )
}

export function Scene3D() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, -5]} intensity={0.3} color="#ff2d95" />

        <FloatingShape position={[-4, 3, -2]} color="#ff2d95" speed={0.8} shape="sphere" />
        <FloatingShape position={[4, -2, -3]} color="#00e5ff" speed={1.2} shape="torus" distort={0.4} />
        <FloatingShape position={[-3, -3, -5]} color="#39ff14" speed={0.6} shape="icosahedron" distort={0.2} />
        <FloatingShape position={[3.5, 3.5, -4]} color="#a855f7" speed={1.0} shape="sphere" distort={0.5} />
        <FloatingShape position={[0, -3.5, -6]} color="#ff6b35" speed={0.7} shape="torus" />
      </Canvas>
    </div>
  )
}
