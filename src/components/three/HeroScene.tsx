import { useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { useTheme, type Theme } from '@/hooks/useTheme'
import { GRID, barHeight, seeded } from './terrain'

const GAP = 0.58
const SIZE = 0.42
const COUNT = GRID * GRID
const HALF = (GRID - 1) / 2

const palettes: Record<Theme, { low: string; high: string; grid: string; particles: string; fog: string; light: string }> = {
  dark: { low: '#0f1d42', high: '#4f8cff', grid: '#1f3263', particles: '#8fb4ff', fog: '#050b1f', light: '#4f8cff' },
  light: { low: '#d3dcef', high: '#1d4ed8', grid: '#b9c6e0', particles: '#1d4ed8', fog: '#f5f7fc', light: '#3b82f6' },
}

type PointerRef = MutableRefObject<{ x: number; y: number }>

/** Smoothly approaches `target` independent of frame rate. */
const damp = (current: number, target: number, lambda: number, delta: number) =>
  THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * delta))

function DataBars({ pointer, theme }: { pointer: PointerRef; theme: Theme }) {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const focus = useRef({ x: HALF, z: HALF })
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const scratch = useMemo(() => new THREE.Color(), [])
  const low = useMemo(() => new THREE.Color(palettes[theme].low), [theme])
  const high = useMemo(() => new THREE.Color(palettes[theme].high), [theme])
  const geometry = useMemo(() => {
    const g = new THREE.BoxGeometry(SIZE, 1, SIZE)
    g.translate(0, 0.5, 0) // grow bars upward from the floor
    return g
  }, [])

  const write = (t: number) => {
    let i = 0
    for (let x = 0; x < GRID; x++) {
      for (let z = 0; z < GRID; z++) {
        const h = barHeight(x, z, t, focus.current.x, focus.current.z)
        dummy.position.set((x - HALF) * GAP, 0, (z - HALF) * GAP)
        dummy.scale.set(1, h, 1)
        dummy.updateMatrix()
        mesh.current.setMatrixAt(i, dummy.matrix)
        const k = THREE.MathUtils.clamp((h - 1.1) / 2.9, 0, 1)
        scratch.copy(low).lerp(high, k * k * (3 - 2 * k))
        mesh.current.setColorAt(i, scratch)
        i++
      }
    }
    mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
  }

  // Instance colours must exist before the first render so the shader compiles with them.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => write(0), [low, high])

  useFrame((state, delta) => {
    // Map the cursor (−1…1) onto grid coordinates; the peak follows it.
    focus.current.x = damp(focus.current.x, HALF + pointer.current.x * HALF * 1.1, 3, delta)
    focus.current.z = damp(focus.current.z, HALF - pointer.current.y * HALF * 1.1, 3, delta)
    write(state.clock.elapsedTime)
  })

  return (
    <instancedMesh ref={mesh} args={[geometry, undefined, COUNT]} castShadow={false} receiveShadow={false}>
      <meshStandardMaterial roughness={0.38} metalness={0.15} />
    </instancedMesh>
  )
}

function DataParticles({ theme }: { theme: Theme }) {
  const points = useRef<THREE.Points>(null!)
  const positions = useMemo(() => {
    const count = 420
    const array = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 6 + seeded(i) * 5
      const theta = seeded(i + 1000) * Math.PI * 2
      const phi = Math.acos(2 * seeded(i + 2000) - 1)
      array[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      array[i * 3 + 1] = Math.abs(r * Math.cos(phi)) * 0.6 - 0.5
      array[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    return array
  }, [])

  useFrame((_, delta) => {
    points.current.rotation.y += delta * 0.025
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color={palettes[theme].particles}
        transparent
        opacity={theme === 'dark' ? 0.75 : 0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/** Tilts the whole chart toward the cursor and keeps it framed on any aspect ratio. */
function Rig({ pointer, children }: { pointer: PointerRef; children: ReactNode }) {
  const group = useRef<THREE.Group>(null!)
  const { camera, size } = useThree()

  useEffect(() => {
    const portrait = size.width / size.height < 1
    const distance = portrait ? 21 : 17.5
    camera.position.set(distance * 0.68, distance * 0.56, distance * 0.68)
    camera.lookAt(0, 1.1, 0)
  }, [camera, size.width, size.height])

  useFrame((state, delta) => {
    const g = group.current
    g.rotation.y = damp(g.rotation.y, -0.18 + pointer.current.x * 0.32 + Math.sin(state.clock.elapsedTime * 0.15) * 0.06, 2.5, delta)
    g.rotation.x = damp(g.rotation.x, pointer.current.y * 0.07, 2.5, delta)
  })

  return <group ref={group}>{children}</group>
}

function SignalReady({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    const id = requestAnimationFrame(() => onReady())
    return () => cancelAnimationFrame(id)
  }, [onReady])
  return null
}

interface HeroSceneProps {
  /** Pauses rendering when the hero is scrolled out of view. */
  active: boolean
  onReady: () => void
}

/** Lazy-loaded WebGL hero: an interactive 3D bar-chart terrain that follows the cursor. */
export default function HeroScene({ active, onReady }: HeroSceneProps) {
  const { theme } = useTheme()
  const palette = palettes[theme]
  const pointer = useRef({ x: 0.15, y: -0.1 })
  const [dpr, setDpr] = useState(1.5)

  // Track the cursor across the whole window — the canvas sits behind content.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [10, 8, 10], fov: 30, near: 0.1, far: 80 }}
      // Refuse software-emulated WebGL (e.g. SwiftShader); HeroVisual then keeps the static SVG.
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', failIfMajorPerformanceCaveat: true }}
      aria-hidden="true"
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(Math.min(window.devicePixelRatio, 1.75))} />
      <fog attach="fog" args={[palette.fog, 18, 34]} />
      <ambientLight intensity={theme === 'dark' ? 0.55 : 1.1} />
      <directionalLight position={[6, 12, 4]} intensity={theme === 'dark' ? 1.6 : 1.4} />
      <pointLight position={[-4, 6, -3]} intensity={theme === 'dark' ? 40 : 14} color={palette.light} distance={22} />
      <Rig pointer={pointer}>
        <DataBars pointer={pointer} theme={theme} />
        <gridHelper args={[GRID * GAP + 3, GRID + 5, palette.grid, palette.grid]} position={[0, -0.005, 0]} />
        <DataParticles theme={theme} />
      </Rig>
      <SignalReady onReady={onReady} />
    </Canvas>
  )
}
