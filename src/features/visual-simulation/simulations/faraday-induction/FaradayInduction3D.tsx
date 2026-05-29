"use client";

import { useEffect, useMemo, useRef, type Dispatch, type SetStateAction } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { VisualToggles } from "@/features/visual-simulation/components/OrbitControlToolbar";
import { Interactive3DViewport } from "@/features/visual-simulation/components/Interactive3DViewport";

type Faraday3DProps = {
  phase: number;
  setPhase: Dispatch<SetStateAction<number>>;
  magnetSpeed: number;
  magneticField: number;
  coilTurns: number;
  coilArea: number;
  current: number;
  meterDeflection: number;
  toggles: VisualToggles;
  failureMode: string;
  resetCameraSignal: number;
  activeObjectIds: string[];
};

function CameraControls({ signal, autoRotate }: { signal: number; autoRotate: boolean }) {
  const { camera } = useThree();
  const controls = useRef<OrbitControlsImpl | null>(null);

  useEffect(() => {
    camera.position.set(4.2, 2.6, 4.8);
    controls.current?.target.set(0.3, -0.25, 0);
    controls.current?.update();
  }, [camera, signal]);

  return <OrbitControls ref={controls} makeDefault enableDamping enablePan enableZoom autoRotate={autoRotate} autoRotateSpeed={0.75} />;
}

function Label({ children, position }: { children: string; position: [number, number, number] }) {
  return (
    <Html position={position} center distanceFactor={8}>
      <div className="whitespace-nowrap rounded-md border border-border bg-background/95 px-2 py-1 text-[11px] font-medium shadow">
        {children}
      </div>
    </Html>
  );
}

function MovingMagnet({
  phase,
  setPhase,
  speed,
  playing,
  exploded,
  highlighted,
  stopped
}: {
  phase: number;
  setPhase: Dispatch<SetStateAction<number>>;
  speed: number;
  playing: boolean;
  exploded: boolean;
  highlighted?: boolean;
  stopped: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (playing && !stopped) setPhase((value) => (value + speed * delta) % (Math.PI * 2));
    if (group.current) {
      group.current.position.x = -1.55 + Math.sin(phase) * 0.9 - (exploded ? 0.35 : 0);
    }
  });

  return (
    <group ref={group}>
      <mesh position={[-0.28, 0, 0]}>
        <boxGeometry args={[0.56, 0.48, 0.48]} />
        <meshStandardMaterial color="#2563eb" emissive="#2563eb" emissiveIntensity={highlighted ? 0.24 : 0.05} />
      </mesh>
      <mesh position={[0.28, 0, 0]}>
        <boxGeometry args={[0.56, 0.48, 0.48]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={highlighted ? 0.24 : 0.05} />
      </mesh>
      <Text position={[-0.28, 0.34, 0]} fontSize={0.18} color="white" anchorX="center">N</Text>
      <Text position={[0.28, 0.34, 0]} fontSize={0.18} color="white" anchorX="center">S</Text>
    </group>
  );
}

function Coil({ turns, area, cutaway, exploded, highlighted }: { turns: number; area: number; cutaway: boolean; exploded: boolean; highlighted?: boolean }) {
  const radius = 0.55 + area * 2.2;
  const visibleTurns = Math.max(5, Math.min(12, Math.round(turns / 4)));
  return (
    <group position={[exploded ? 0.2 : 0, 0, 0]}>
      {Array.from({ length: visibleTurns }, (_, index) => (
        <mesh key={index} position={[0.42 + index * 0.055, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius, 0.024, 10, 56]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.55} roughness={0.24} emissive="#f59e0b" emissiveIntensity={highlighted ? 0.24 : 0.06} transparent opacity={cutaway && index % 2 === 0 ? 0.34 : 1} />
        </mesh>
      ))}
      {cutaway ? (
        <mesh position={[0.72, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 1.9, 12]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.3} />
        </mesh>
      ) : null}
    </group>
  );
}

function FieldLines({ visible, strength, phase, highlighted }: { visible: boolean; strength: number; phase: number; highlighted?: boolean }) {
  if (!visible) return null;
  const lines = Math.max(3, Math.round(3 + strength * 3));
  const direction = Math.cos(phase) >= 0 ? 1 : -1;
  return (
    <group>
      {Array.from({ length: lines }, (_, index) => {
        const y = -0.65 + (index / Math.max(1, lines - 1)) * 1.3;
        return (
          <group key={index} position={[-0.7, y, -0.45]} rotation={[0, direction > 0 ? 0 : Math.PI, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.015, 0.015, 2.1, 10]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={highlighted ? 0.5 : 0.22} transparent opacity={0.72} />
            </mesh>
            <mesh position={[1.1, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.07, 0.2, 16]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.28} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function CurrentCircuit({ current, visible, open, highlighted }: { current: number; visible: boolean; open: boolean; highlighted?: boolean }) {
  const color = current >= 0 ? "#22c55e" : "#fb7185";
  const direction = current >= 0 ? 1 : -1;
  return (
    <group>
      <mesh position={[1.25, -1.0, 0.62]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 2.2, 10]} />
        <meshStandardMaterial color={open ? "#64748b" : "#94a3b8"} transparent opacity={open ? 0.35 : 1} emissive={highlighted ? "#22c55e" : "#000000"} emissiveIntensity={0.12} />
      </mesh>
      <mesh position={[2.35, -1.0, 0.62]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.022, 8, 64, Math.PI]} />
        <meshStandardMaterial color={open ? "#64748b" : "#94a3b8"} transparent opacity={open ? 0.35 : 1} />
      </mesh>
      {visible ? (
        <group position={[1.45, -1.0, 0.72]} rotation={[0, direction > 0 ? 0 : Math.PI, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.024, 0.024, 0.72, 12]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} transparent opacity={open ? 0.15 : 0.95} />
          </mesh>
          <mesh position={[0.38, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.09, 0.22, 16]} />
            <meshStandardMaterial color={color} transparent opacity={open ? 0.15 : 0.95} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
}

function Galvanometer({ deflection, highlighted }: { deflection: number; highlighted?: boolean }) {
  return (
    <group position={[2.45, -1.0, 0.92]} rotation={[-0.55, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[0.42, 0.42, 0.12, 48]} />
        <meshStandardMaterial color="#0f172a" emissive="#111827" emissiveIntensity={highlighted ? 0.16 : 0.03} />
      </mesh>
      <mesh position={[0, 0.07, 0]} rotation={[Math.PI / 2, 0, deflection * 0.85]}>
        <boxGeometry args={[0.035, 0.02, 0.56]} />
        <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.3} />
      </mesh>
      <Text position={[0, 0.14, -0.38]} rotation={[Math.PI / 2, 0, 0]} fontSize={0.08} color="#facc15" anchorX="center">meter</Text>
    </group>
  );
}

function FormulaPanel({ phase, current, visible }: { phase: number; current: number; visible: boolean }) {
  if (!visible) return null;
  return (
    <Html position={[2.1, 1.15, -1.1]} transform distanceFactor={6}>
      <div className="w-60 rounded-lg border border-white/15 bg-slate-950/92 p-3 text-[11px] text-white shadow-xl">
        <p className="font-semibold text-sky-300">Faraday chain</p>
        <p className="mt-1 font-mono">Phi = B A cos(theta)</p>
        <p className="font-mono">epsilon = -N dPhi/dt</p>
        <p className="font-mono">I = epsilon / R</p>
        <p className="mt-2 text-slate-300">motion phase {Math.round((phase * 180) / Math.PI) % 360} deg, current {current.toFixed(2)} A</p>
      </div>
    </Html>
  );
}

function FaradayModel({
  phase,
  setPhase,
  magnetSpeed,
  magneticField,
  coilTurns,
  coilArea,
  current,
  meterDeflection,
  toggles,
  failureMode,
  activeObjectIds
}: Faraday3DProps) {
  const active = useMemo(() => new Set(activeObjectIds), [activeObjectIds]);
  const stopped = failureMode === "magnet-stopped";
  const open = failureMode === "open-circuit";
  const weakField = failureMode === "weak-field";

  return (
    <group>
      <MovingMagnet phase={phase} setPhase={setPhase} speed={magnetSpeed} playing={toggles.playing} exploded={toggles.exploded} highlighted={active.has("moving-magnet")} stopped={stopped} />
      <FieldLines visible={toggles.fieldLines} strength={weakField ? 0.2 : magneticField} phase={phase} highlighted={active.has("field-lines")} />
      <Coil turns={coilTurns} area={coilArea} cutaway={toggles.cutaway} exploded={toggles.exploded} highlighted={active.has("coil")} />
      <CurrentCircuit current={current} visible={toggles.currentArrows} open={open} highlighted={active.has("external-wire") || active.has("current-arrows")} />
      <Galvanometer deflection={meterDeflection} highlighted={active.has("galvanometer")} />
      <FormulaPanel phase={phase} current={current} visible={toggles.formula} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.45, -1.55, 0]}>
        <planeGeometry args={[5.8, 3.8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.82} />
      </mesh>

      {open ? <Label position={[1.55, -1.22, 0.9]}>Open circuit: no current through meter</Label> : null}
      {stopped ? <Label position={[-1.55, 0.62, 0]}>Stopped magnet: flux is constant</Label> : null}

      {toggles.labels ? (
        <>
          <Label position={[-1.85, 0.72, 0]}>Moving magnet: changes flux</Label>
          <Label position={[0.72, 0.92, 0]}>Coil: N turns and area A</Label>
          <Label position={[2.45, -0.35, 1.0]}>Galvanometer: output I</Label>
          <Label position={[0.3, -1.18, 0.85]}>Closed wire path R</Label>
        </>
      ) : null}
    </group>
  );
}

export function FaradayInduction3D(props: Faraday3DProps) {
  return (
    <Interactive3DViewport caption="Orbit, zoom and pan are enabled. Toggle explode/cutaway to inspect the magnet, coil and circuit path.">
      <Canvas camera={{ position: [4.2, 2.6, 4.8], fov: 48 }}>
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.72} />
        <directionalLight position={[4, 5, 5]} intensity={1.4} />
        <pointLight position={[-3, 2, -2]} intensity={0.45} />
        <FaradayModel {...props} />
        <CameraControls signal={props.resetCameraSignal} autoRotate={props.toggles.autoRotate} />
      </Canvas>
    </Interactive3DViewport>
  );
}
