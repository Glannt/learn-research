"use client";

import { useEffect, useMemo, useRef, type Dispatch, type SetStateAction } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { VisualToggles } from "@/features/visual-simulation/components/OrbitControlToolbar";
import { Interactive3DViewport } from "@/features/visual-simulation/components/Interactive3DViewport";
import { AlternatingCurrentArrows } from "@/features/visual-simulation/simulations/ac-generator/AlternatingCurrentArrows";
import { CoilPositionIndicator } from "@/features/visual-simulation/simulations/ac-generator/CoilPositionIndicator";
import { LampBrightnessIndicator } from "@/features/visual-simulation/simulations/ac-generator/LampBrightnessIndicator";
import { MagneticFieldLines, RotationArrow } from "@/features/visual-simulation/simulations/ac-generator/MagneticFieldLines";
import { SlipRingBrushAssembly } from "@/features/visual-simulation/simulations/ac-generator/SlipRingBrushAssembly";

type AC3DProps = {
  angle: number;
  setAngle: Dispatch<SetStateAction<number>>;
  omega: number;
  magneticField: number;
  current: number;
  lampBrightness: number;
  toggles: VisualToggles;
  failureMode: string;
  resetCameraSignal: number;
  activeObjectIds: string[];
};

function CameraControls({ signal, autoRotate }: { signal: number; autoRotate: boolean }) {
  const { camera } = useThree();
  const controls = useRef<OrbitControlsImpl | null>(null);

  useEffect(() => {
    camera.position.set(4.2, 3, 5.2);
    controls.current?.target.set(0, -0.45, 0);
    controls.current?.update();
  }, [camera, signal]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      enablePan
      enableZoom
      autoRotate={autoRotate}
      autoRotateSpeed={0.8}
    />
  );
}

function BoxLabel({ children, position }: { children: string; position: [number, number, number] }) {
  return (
    <Html position={position} center distanceFactor={8}>
      <div className="whitespace-nowrap rounded-md border border-border bg-background/95 px-2 py-1 text-[11px] font-medium shadow">
        {children}
      </div>
    </Html>
  );
}

function HighlightRing({ visible, position }: { visible: boolean; position: [number, number, number] }) {
  if (!visible) return null;
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.58, 0.018, 8, 72]} />
      <meshBasicMaterial color="#facc15" transparent opacity={0.82} />
    </mesh>
  );
}

function Coil({
  angle,
  setAngle,
  omega,
  playing,
  exploded,
  cutaway,
  highlighted
}: {
  angle: number;
  setAngle: Dispatch<SetStateAction<number>>;
  omega: number;
  playing: boolean;
  exploded: boolean;
  cutaway: boolean;
  highlighted?: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (playing) {
      setAngle((value) => (value + omega * delta) % (Math.PI * 2));
    }
    if (group.current) group.current.rotation.y = angle;
  });

  const width = cutaway ? 0.86 : 1.18;
  const height = 1.74;
  const emissive = highlighted ? 0.3 : 0.08;

  return (
    <group ref={group} position={[0, exploded ? 0.35 : 0, 0]}>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, 0.06, 0.06]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.45} roughness={0.28} emissive="#f59e0b" emissiveIntensity={emissive} />
      </mesh>
      <mesh position={[0, -height / 2, 0]}>
        <boxGeometry args={[width, 0.06, 0.06]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.45} roughness={0.28} emissive="#f59e0b" emissiveIntensity={emissive} />
      </mesh>
      <mesh position={[-width / 2, 0, 0]}>
        <boxGeometry args={[0.06, height, 0.06]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.45} roughness={0.28} emissive="#f59e0b" emissiveIntensity={emissive} />
      </mesh>
      <mesh position={[width / 2, 0, 0]}>
        <boxGeometry args={[0.06, height, 0.06]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.45} roughness={0.28} emissive="#f59e0b" emissiveIntensity={emissive} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, cutaway ? 2.6 : 2.1, 18]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.25} transparent opacity={cutaway ? 0.96 : 1} />
      </mesh>
      {cutaway ? (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.34]}>
          <cylinderGeometry args={[0.012, 0.012, 1.85, 12]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.35} />
        </mesh>
      ) : null}
      <HighlightRing visible={Boolean(highlighted)} position={[0, 0, 0]} />
    </group>
  );
}

function WireCircuit({ highlighted }: { highlighted?: boolean }) {
  const color = highlighted ? "#cbd5e1" : "#94a3b8";
  return (
    <group>
      <mesh position={[-0.78, -1.63, 0.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 1.45, 10]} />
        <meshStandardMaterial color={color} emissive={highlighted ? "#22c55e" : "#000000"} emissiveIntensity={0.18} />
      </mesh>
      <mesh position={[0.78, -1.63, 0.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 1.45, 10]} />
        <meshStandardMaterial color={color} emissive={highlighted ? "#22c55e" : "#000000"} emissiveIntensity={0.18} />
      </mesh>
      <mesh position={[0, -2.0, 1.1]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <torusGeometry args={[0.95, 0.022, 8, 64, Math.PI]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function ACWavePanel({ angle, current, visible }: { angle: number; current: number; visible: boolean }) {
  if (!visible) return null;
  const marker = ((angle % (Math.PI * 2)) / (Math.PI * 2)) * 160;
  const path = Array.from({ length: 64 }, (_, index) => {
    const x = (index / 63) * 160;
    const y = 40 - Math.sin((index / 63) * Math.PI * 2) * 25;
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");

  return (
    <Html position={[2.9, 1.22, -1.05]} transform distanceFactor={6}>
      <div className="w-56 rounded-lg border border-white/15 bg-slate-950/92 p-3 text-white shadow-xl">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-sky-300">AC output</span>
          <span className={current >= 0 ? "text-emerald-300" : "text-rose-300"}>{current >= 0 ? "+ half" : "- half"}</span>
        </div>
        <svg viewBox="0 0 160 80" className="mt-2 h-20 w-full">
          <line x1="0" y1="40" x2="160" y2="40" stroke="#475569" strokeWidth="2" />
          <path d={path} fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
          <line x1={marker} y1="8" x2={marker} y2="72" stroke="#f97316" strokeWidth="3" />
          <circle cx={marker} cy={40 - Math.sin(angle) * 25} r="5" fill="#f97316" />
        </svg>
      </div>
    </Html>
  );
}

function GeneratorModel({
  angle,
  setAngle,
  omega,
  magneticField,
  current,
  lampBrightness,
  toggles,
  failureMode,
  activeObjectIds
}: AC3DProps) {
  const isActive = useMemo(() => new Set(activeObjectIds), [activeObjectIds]);
  const weak = failureMode === "weak-field";
  const magnetOffset = toggles.exploded ? 0.36 : 0;
  const circuitActive = isActive.has("external-wire") || isActive.has("current-arrows");

  return (
    <group>
      <mesh position={[-2.2 - magnetOffset, toggles.exploded ? 0.18 : 0, 0]}>
        <boxGeometry args={[0.7, 2.1, 1.26]} />
        <meshStandardMaterial color="#2563eb" metalness={0.1} roughness={0.38} emissive="#2563eb" emissiveIntensity={isActive.has("magnet-n") ? 0.24 : 0.04} />
      </mesh>
      <mesh position={[2.2 + magnetOffset, toggles.exploded ? 0.18 : 0, 0]}>
        <boxGeometry args={[0.7, 2.1, 1.26]} />
        <meshStandardMaterial color="#ef4444" metalness={0.1} roughness={0.38} emissive="#ef4444" emissiveIntensity={isActive.has("magnet-s") ? 0.24 : 0.04} />
      </mesh>
      <Text position={[-2.2 - magnetOffset, 1.26, 0]} fontSize={0.28} color="white" anchorX="center">N</Text>
      <Text position={[2.2 + magnetOffset, 1.26, 0]} fontSize={0.28} color="white" anchorX="center">S</Text>

      <MagneticFieldLines strength={weak ? 0.25 : magneticField} visible={toggles.fieldLines} highlighted={isActive.has("field-lines")} />
      <RotationArrow visible highlighted={isActive.has("rotation-arrow") || isActive.has("rotating-coil")} />
      <Coil angle={angle} setAngle={setAngle} omega={failureMode === "coil-stopped" ? 0 : omega} playing={toggles.playing} exploded={toggles.exploded} cutaway={toggles.cutaway} highlighted={isActive.has("rotating-coil")} />
      <SlipRingBrushAssembly exploded={toggles.exploded} failureMode={failureMode} highlighted={isActive.has("slip-ring-1") || isActive.has("brush-1")} />
      <WireCircuit highlighted={circuitActive} />
      <LampBrightnessIndicator brightness={failureMode === "brush-disconnected" ? 0 : lampBrightness} highlighted={isActive.has("lamp")} />
      <AlternatingCurrentArrows current={current} visible={toggles.currentArrows} failureMode={failureMode} highlighted={isActive.has("current-arrows")} />
      <CoilPositionIndicator angle={angle} current={current} />
      <ACWavePanel angle={angle} current={current} visible={toggles.formula || isActive.has("wave-chart-panel")} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.55, 0]}>
        <planeGeometry args={[6.4, 4.8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.05} />
      </mesh>

      {failureMode === "brush-disconnected" ? (
        <BoxLabel position={[0, -1.78, 0.22]}>Open circuit: brush not touching slip ring</BoxLabel>
      ) : null}

      {toggles.labels ? (
        <>
          <BoxLabel position={[-2.2 - magnetOffset, -1.4, 0]}>N magnet: B field source</BoxLabel>
          <BoxLabel position={[2.2 + magnetOffset, -1.4, 0]}>S magnet: field return</BoxLabel>
          <BoxLabel position={[0, 1.55, 0]}>Rotating coil: Phi changes</BoxLabel>
          <BoxLabel position={[0.9, -1.3, 0.8]}>Slip rings + brushes</BoxLabel>
          <BoxLabel position={[0, -2.65, 1.75]}>Lamp / load R</BoxLabel>
        </>
      ) : null}
    </group>
  );
}

export function ACGenerator3D(props: AC3DProps) {
  return (
    <Interactive3DViewport caption="Orbit with mouse, zoom with wheel, pan with right/middle drag. Explode and cutaway are controlled from the toolbar.">
      <Canvas camera={{ position: [4.2, 3, 5.2], fov: 48 }}>
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 5, 5]} intensity={1.4} />
        <pointLight position={[-3, 2, -2]} intensity={0.6} />
        <GeneratorModel {...props} />
        <CameraControls signal={props.resetCameraSignal} autoRotate={props.toggles.autoRotate} />
      </Canvas>
    </Interactive3DViewport>
  );
}
