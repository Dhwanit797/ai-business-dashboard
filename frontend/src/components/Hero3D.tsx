import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

const PRIMARY_GLOW = '#38BDF8'
const SECONDARY_GLOW = '#2DD4BF'
const LIGHT_BG = '#f8fafc'
const DARK_INDIGO = '#1e3a5f'
const LIGHT_SURFACE = '#e2e8f0'
const LIGHT_INDIGO_TINT = '#c7d2fe'
const RIM_DARK = '#6366f1'
const RIM_LIGHT = '#818cf8'

/** Fresnel rim highlight – edge glow only */
const fresnelVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`
const fresnelFragment = /* glsl */ `
  uniform vec3 rimColor;
  uniform float rimPower;
  uniform float opacity;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), rimPower);
    gl_FragColor = vec4(rimColor, fresnel * opacity);
  }
`

function FresnelRim({ isLight }: { isLight: boolean }) {
  const uniforms = useMemo(
    () => ({
      rimColor: { value: new THREE.Color(isLight ? RIM_LIGHT : RIM_DARK) },
      rimPower: { value: 2.2 },
      opacity: { value: isLight ? 0.12 : 0.18 },
    }),
    [isLight]
  )
  return (
    <mesh>
      <sphereGeometry args={[0.86, 64, 64]} />
      <shaderMaterial
        vertexShader={fresnelVertex}
        fragmentShader={fresnelFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.BackSide}
      />
    </mesh>
  )
}

/** Inner core glow – slow pulse, theme-adaptive */
function InnerCoreGlow({ isLight }: { isLight: boolean }) {
  const mesh = useRef<THREE.Mesh>(null)
  const color = isLight ? LIGHT_INDIGO_TINT : PRIMARY_GLOW
  useFrame((state) => {
    if (!mesh.current?.material || !(mesh.current.material instanceof THREE.MeshBasicMaterial)) return
    const t = state.clock.elapsedTime * 0.35
    const breath = 0.05 + 0.07 * Math.sin(t)
    mesh.current.material.opacity = Math.min(0.15, breath)
  })
  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[0.32, 32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.08}
        depthWrite={false}
        side={THREE.BackSide}
      />
    </mesh>
  )
}

/** Very subtle tech grid overlay – low opacity */
function TechGridOverlay({ isLight }: { isLight: boolean }) {
  return (
    <mesh>
      <sphereGeometry args={[0.855, 32, 24]} />
      <meshBasicMaterial
        color={isLight ? '#64748b' : PRIMARY_GLOW}
        transparent
        opacity={isLight ? 0.04 : 0.035}
        wireframe
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

/** Glass sphere: data core look – theme-aware material */
function GlassSphere({
  isLight,
  hoverRef,
}: {
  isLight: boolean
  hoverRef: React.MutableRefObject<number>
}) {
  const mesh = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null)

  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.elapsedTime
    mesh.current.rotation.y = t * 0.06
    mesh.current.rotation.x = Math.sin(t * 0.12) * 0.04
    mesh.current.rotation.z = Math.sin(t * 0.08) * 0.02
  })

  useFrame(() => {
    if (!materialRef.current) return
    const h = hoverRef.current
    const baseEmissive = isLight ? 0.03 : 0.05
    const baseOpacity = isLight ? 0.38 : 0.14
    materialRef.current.emissiveIntensity = baseEmissive + h * 0.025
    materialRef.current.opacity = Math.min(1, baseOpacity + h * 0.03)
  })

  const baseColor = isLight ? LIGHT_SURFACE : DARK_INDIGO
  const emissiveColor = isLight ? LIGHT_INDIGO_TINT : PRIMARY_GLOW

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[0.85, 64, 64]} />
      <meshPhysicalMaterial
        ref={materialRef}
        color={baseColor}
        transparent
        opacity={isLight ? 0.38 : 0.14}
        transmission={isLight ? 0.82 : 0.9}
        thickness={0.35}
        roughness={0.08}
        metalness={isLight ? 0.03 : 0.06}
        envMapIntensity={isLight ? 0.65 : 0.55}
        emissive={new THREE.Color(emissiveColor)}
        emissiveIntensity={isLight ? 0.03 : 0.05}
        clearcoat={0.18}
        clearcoatRoughness={0.12}
      />
    </mesh>
  )
}

/** Soft animated outer energy ring */
function EnergyRing({ isLight }: { isLight: boolean }) {
  const ring = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ring.current) {
      ring.current.rotation.z = state.clock.elapsedTime * 0.05
      const mat = ring.current.material as THREE.MeshBasicMaterial
      if (mat) mat.opacity = 0.1 + 0.04 * Math.sin(state.clock.elapsedTime * 0.4)
    }
  })
  return (
    <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.02, 0.01, 16, 64]} />
      <meshBasicMaterial
        color={PRIMARY_GLOW}
        transparent
        opacity={isLight ? 0.08 : 0.12}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

/** Data lines anchored just off sphere surface + subtle pulse on hover */
function OuterDataLines({
  isLight,
  hoverRef,
}: {
  isLight: boolean
  hoverRef: React.MutableRefObject<number>
}) {
  const lineRef = useRef<THREE.Line>(null)
  const radius = 0.92
  const curves = useMemo(() => {
    const pts: number[] = []
    for (let i = 0; i < 3; i++) {
      const t = (i / 3) * Math.PI * 2
      for (let j = 0; j <= 8; j++) {
        const u = (j / 8) * Math.PI * 2 + t * 0.3
        pts.push(
          Math.cos(u) * radius + (Math.random() - 0.5) * 0.06,
          Math.sin(j * 0.4) * 0.25,
          Math.sin(u) * radius + (Math.random() - 0.5) * 0.06
        )
      }
    }
    return new Float32Array(pts)
  }, [])

  const lineOpacity = isLight ? 0.22 : 0.16
  useFrame((state) => {
    if (lineRef.current?.material && lineRef.current.material instanceof THREE.LineBasicMaterial) {
      const t = state.clock.elapsedTime * 0.35
      const pulse = 0.7 + 0.3 * Math.sin(t)
      const h = hoverRef.current
      lineRef.current.material.opacity = Math.min(0.35, (lineOpacity + h * 0.06) * pulse)
      lineRef.current.material.color.setStyle(PRIMARY_GLOW)
    }
  })

  return (
    <group>
      <line ref={lineRef as any}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={curves.length / 3} array={curves} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={PRIMARY_GLOW} transparent opacity={lineOpacity} />
      </line>
    </group>
  )
}

/** Neural core inside sphere */
function NeuralCore({ isLight }: { isLight: boolean }) {
  const lineRef = useRef<THREE.Line>(null)
  const nodesRef = useRef<THREE.Group>(null)
  const nodeCount = 12
  const nodes = useMemo(() => {
    const seed = 0.5
    return Array.from({ length: nodeCount }, (_, i) => {
      const t = (i / nodeCount) * Math.PI * 2 + seed
      const u = Math.acos(2 * (i / nodeCount) - 1) - Math.PI / 2
      return new THREE.Vector3(
        Math.cos(u) * Math.cos(t) * 0.48,
        Math.sin(u) * 0.48,
        Math.cos(u) * Math.sin(t) * 0.48
      )
    })
  }, [])
  const pairs = useMemo(() => {
    const p: [number, number][] = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 0.52) p.push([i, j])
      }
    }
    return p
  }, [nodes])
  const linePositions = useMemo(
    () =>
      new Float32Array(
        pairs.flatMap(([a, b]) => [
          nodes[a].x, nodes[a].y, nodes[a].z,
          nodes[b].x, nodes[b].y, nodes[b].z,
        ])
      ),
    [pairs, nodes]
  )
  const lineOpacity = isLight ? 0.5 : 0.45

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.5
    if (lineRef.current?.material && lineRef.current.material instanceof THREE.LineBasicMaterial) {
      const pulse = 0.5 + 0.45 * Math.sin(t) * Math.sin(t * 0.7)
      lineRef.current.material.opacity = Math.max(0.18, pulse * lineOpacity)
      lineRef.current.material.color.setStyle(PRIMARY_GLOW)
    }
    if (nodesRef.current) {
      nodesRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
          const pulse = 0.45 + 0.5 * Math.sin(t + i * 0.5) ** 2
          child.material.opacity = Math.max(0.2, pulse * (isLight ? 0.65 : 0.6))
          child.material.color.setStyle(PRIMARY_GLOW)
        }
      })
    }
  })

  return (
    <group>
      <line ref={lineRef as any}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={PRIMARY_GLOW} transparent opacity={lineOpacity} />
      </line>
      <group ref={nodesRef}>
        {nodes.map((pos, i) => (
          <mesh key={i} position={[pos.x, pos.y, pos.z]}>
            <sphereGeometry args={[0.028, 10, 10]} />
            <meshBasicMaterial color={PRIMARY_GLOW} transparent opacity={isLight ? 0.65 : 0.6} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/** Optional subtle particle orbit ring */
function ParticleOrbitRing({ isLight, enabled }: { isLight: boolean; enabled: boolean }) {
  const ref = useRef<THREE.Points>(null)
  const count = 80
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3)
    const r = 1.0
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2
      p[i * 3] = Math.cos(t) * r
      p[i * 3 + 1] = 0
      p[i * 3 + 2] = Math.sin(t) * r
    }
    return p
  }, [])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02
      const mat = ref.current.material as THREE.PointsMaterial
      if (mat) mat.opacity = 0.04 + 0.02 * Math.sin(state.clock.elapsedTime * 0.3)
    }
  })

  if (!enabled) return null
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color={isLight ? LIGHT_INDIGO_TINT : PRIMARY_GLOW}
        transparent
        opacity={0.05}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/** Data panel */
function DataPanel({ chartType, offset }: { chartType: 'line' | 'bar' | 'kpi'; offset: number }) {
  const group = useRef<THREE.Group>(null)
  const { camera } = useThree()
  useFrame((state) => {
    if (group.current) {
      const t = state.clock.elapsedTime * 0.15 + offset
      group.current.position.x = Math.cos(t) * 1.35
      group.current.position.z = Math.sin(t) * 1.35
      group.current.position.y = Math.sin(t * 0.7) * 0.15
      group.current.quaternion.copy(camera.quaternion)
    }
  })
  const linePoints: [number, number, number][] =
    chartType === 'line'
      ? [[0, 0.3, 0], [0.25, 0.15, 0], [0.5, -0.05, 0], [0.75, 0.2, 0], [1, 0.1, 0]]
      : []
  const barSegments: [number, number, number][][] =
    chartType === 'bar'
      ? [
        [[0.1, 0, 0], [0.1, 0.4, 0]],
        [[0.35, 0, 0], [0.35, 0.25, 0]],
        [[0.6, 0, 0], [0.6, 0.35, 0]],
        [[0.85, 0, 0], [0.85, 0.2, 0]],
      ]
      : []

  return (
    <group ref={group}>
      <mesh>
        <planeGeometry args={[0.5, 0.32]} />
        <meshBasicMaterial
          color="#0B1220"
          transparent
          opacity={0.7}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <lineLoop position={[0, 0, 0.02]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={4} array={new Float32Array([0.25, 0.16, 0, -0.25, 0.16, 0, -0.25, -0.16, 0, 0.25, -0.16, 0])} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={PRIMARY_GLOW} transparent opacity={0.35} />
      </lineLoop>
      <group position={[-0.22, 0, 0.01]} scale={[0.2, 0.2, 1]}>
        {chartType === 'line' && <Line points={linePoints} color={PRIMARY_GLOW} lineWidth={1.2} transparent opacity={0.9} />}
        {chartType === 'bar' && barSegments.map((seg, i) => (
          <Line key={i} points={seg} color={i % 2 === 0 ? PRIMARY_GLOW : SECONDARY_GLOW} lineWidth={1} transparent opacity={0.85} />
        ))}
        {chartType === 'kpi' && (
          <group>
            <mesh position={[0.5, 0.1, 0]}><planeGeometry args={[0.15, 0.06]} /><meshBasicMaterial color={SECONDARY_GLOW} transparent opacity={0.9} /></mesh>
            <mesh position={[0.5, -0.05, 0]}><planeGeometry args={[0.08, 0.04]} /><meshBasicMaterial color={PRIMARY_GLOW} transparent opacity={0.7} /></mesh>
          </group>
        )}
      </group>
    </group>
  )
}

/** Ground shadow – lighter in light mode */
function GroundShadow({ isLight }: { isLight: boolean }) {
  const opacity = isLight ? 0.08 : 0.2
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.95, 0]}>
      <circleGeometry args={[1.1, 32]} />
      <meshBasicMaterial
        color={isLight ? LIGHT_BG : '#0B1220'}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

/** Background particles */
function ParticleField({ isLight }: { isLight: boolean }) {
  const points = useRef<THREE.Points>(null)
  const count = 180
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 6
      p[i * 3 + 1] = (Math.random() - 0.5) * 6
      p[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    return p
  }, [])
  useFrame((state) => {
    if (points.current) points.current.rotation.y = state.clock.elapsedTime * 0.02
  })
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color={PRIMARY_GLOW}
        transparent
        opacity={isLight ? 0.14 : 0.22}
        sizeAttenuation
      />
    </points>
  )
}

function Scene({ theme, isMobile }: { theme: 'dark' | 'light'; isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const pl1 = useRef<THREE.PointLight>(null)
  const pl2 = useRef<THREE.PointLight>(null)
  const pl3 = useRef<THREE.PointLight>(null)
  const { pointer } = useThree()
  const isLight = theme === 'light'
  const fogColor = isLight ? LIGHT_BG : '#0B1220'
  const fogNear = 2
  const fogFar = isLight ? 4.5 : 5

  const pointerRef = useRef(new THREE.Vector2(0, 0))
  const hoverRef = useRef(0)

  useFrame(() => {
    pointerRef.current.lerp(pointer, 0.08)
    const dist = Math.sqrt(pointerRef.current.x ** 2 + pointerRef.current.y ** 2)
    const targetHover = isMobile ? 0 : Math.max(0, 1 - dist * 2.5)
    hoverRef.current += (targetHover - hoverRef.current) * 0.06
    const h = hoverRef.current

    if (pl1.current) pl1.current.intensity = isLight ? 0.28 : 0.38 + h * 0.05
    if (pl2.current) pl2.current.intensity = isLight ? 0.18 : 0.22 + h * 0.03
    if (pl3.current) pl3.current.intensity = isLight ? 0.3 : 0.45 + h * 0.04

    if (groupRef.current) {
      const targetX = pointer.y * 0.14
      const targetY = pointer.x * 0.14
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.06
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.06
      const scale = 1 + h * 0.02
      groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.08)
    }
  })

  return (
    <>
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />
      <ambientLight intensity={isLight ? 0.52 : 0.38} />
      <directionalLight position={[3, 4, 5]} intensity={isLight ? 1 : 1.05} />
      <pointLight ref={pl1} position={[-2, 2, 3]} intensity={isLight ? 0.28 : 0.38} color={PRIMARY_GLOW} />
      <pointLight ref={pl2} position={[2, -1, 2]} intensity={isLight ? 0.18 : 0.22} color={SECONDARY_GLOW} />
      <pointLight ref={pl3} position={[-1, 0.5, -1.5]} intensity={isLight ? 0.3 : 0.45} color={PRIMARY_GLOW} />
      <ParticleField isLight={isLight} />
      <group ref={groupRef} position={[0, 0, 0]}>
        <EnergyRing isLight={isLight} />
        <OuterDataLines isLight={isLight} hoverRef={hoverRef} />
        <GroundShadow isLight={isLight} />
        <FresnelRim isLight={isLight} />
        <InnerCoreGlow isLight={isLight} />
        <TechGridOverlay isLight={isLight} />
        <GlassSphere isLight={isLight} hoverRef={hoverRef} />
        <NeuralCore isLight={isLight} />
        <ParticleOrbitRing isLight={isLight} enabled={!isMobile} />
        <DataPanel chartType="line" offset={0} />
        <DataPanel chartType="bar" offset={1.2} />
        <DataPanel chartType="kpi" offset={2.4} />
        <DataPanel chartType="line" offset={3.8} />
        <DataPanel chartType="bar" offset={5} />
      </group>
    </>
  )
}

export default function Hero3D({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)')
    const fn = () => setIsMobile(mql.matches)
    fn()
    mql.addEventListener('change', fn)
    return () => mql.removeEventListener('change', fn)
  }, [])

  return (
    <div className="hero-3d-canvas-wrapper absolute inset-0 z-0 overflow-hidden">
      {typeof window !== 'undefined' && (
        <Canvas camera={{ position: [0, 0, 3.2], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
          <Scene theme={theme} isMobile={isMobile} />
        </Canvas>
      )}
    </div>
  )
}
