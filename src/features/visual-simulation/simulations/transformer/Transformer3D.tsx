"use client";

import { useEffect, useMemo, useRef, type Dispatch, type SetStateAction } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, Text } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { VisualToggles } from "@/features/visual-simulation/components/OrbitControlToolbar";
import { Interactive3DViewport } from "@/features/visual-simulation/components/Interactive3DViewport";

type Transformer3DProps = {
  phase: number;
  setPhase: Dispatch<SetStateAction<number>>;
  frequency: number;
  primaryTurns: number;
  secondaryTurns: number;
  coupling: number;
  secondaryCurrent: number;
  loadBrightness: number;
  toggles: VisualToggles;
  failureMode: string;
  resetCameraSignal: number;
  activeObjectIds: string[];
};

function CameraControls({ signal, autoRotate }: { signal: number; autoRotate: boolean }) {
  const { camera } = useThree();
  const controls = useRef<OrbitControlsImpl | null>(null);

  useEffect(() => {
    camera.position.set(4.4, 2.8, 5);
    controls.current?.target.set(0, -0.25, 0);
    controls.current?.update();
  }, [camera, signal]);

  return <OrbitControls ref={controls} makeDefault enableDamping enablePan enableZoom autoRotate={autoRotate} autoRotateSpeed={0.7} />;
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

function Core({ exploded, cutaway, highlighted, weak }: { exploded: boolean; cutaway: boolean; highlighted?: boolean; weak?: boolean }) {
  const opacity = cutaway ? 0.38 : weak ? 0.48 : 0.86;
  const emissive = highlighted ? 0.18 : 0.04;
  return (
    <group position={[0, exploded ? -0.18 : 0, 0]}>
      {[
        [0, 0.78, 0, 3.25, 0.25, 0.38],
        [0, -0.78, 0, 3.25, 0.25, 0.38],
        [-1.62, 0, 0, 0.25, 1.8, 0.38],
        [1.62, 0, 0, 0.25, 1.8, 0.38]
      ].map(([x, y, z, sx, sy, sz], index) => (
        <mesh key={index} position={[x, y, z]}>
          <boxGeometry args={[sx, sy, sz]} />
          <meshStandardMaterial color="#64748b" metalness={0.35} roughness={0.38} transparent opacity={opacity} emissive="#64748b" emissiveIntensity={emissive} />
        </mesh>
      ))}
    </group>
  );
}

function Coil({ x, turns, highlighted }: { x: number; turns: number; highlighted?: boolean }) {
  const visibleTurns = Math.max(5, Math.min(13, Math.round(turns / 7)));
  return (
    <group position={[x, 0, 0]}>
      {Array.from({ length: visibleTurns }, (_, index) => (
        <mesh key={index} position={[0, -0.52 + index * (1.04 / Math.max(1, visibleTurns - 1)), 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.46, 0.026, 10, 54]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.5} roughness={0.24} emissive="#f59e0b" emissiveIntensity={highlighted ? 0.24 : 0.06} />
        </mesh>
      ))}
    </group>
  );
}

function FluxPulse({ visible, phase, coupling, highlighted }: { visible: boolean; phase: number; coupling: number; highlighted?: boolean }) {
  if (!visible) return null;
  const strength = Math.abs(Math.sin(phase)) * coupling;
  const opacity = 0.22 + strength * 0.55;
  return (
    <group>
      {[0.52, 0.78, -0.52, -0.78].map((y, index) => (
        <mesh key={index} position={[0, y, 0.32]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018 + strength * 0.018, 0.018 + strength * 0.018, 2.45, 12]} />
          <meshStandardMaterial color="#818cf8" emissive="#6366f1" emissiveIntensity={highlighted ? 0.5 : 0.28} transparent opacity={opacity} />
        </mesh>
      ))}
      <mesh position={[1.25, 0.78, 0.32]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.09, 0.24, 16]} />
        <meshStandardMaterial color="#818cf8" emissive="#6366f1" emissiveIntensity={0.3} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

function CurrentArrows({ phase, visible, open, highlighted }: { phase: number; visible: boolean; open: boolean; highlighted?: boolean }) {
  if (!visible) return null;
  const positive = Math.sin(phase) >= 0;
  const color = positive ? "#22c55e" : "#fb7185";
  const opacity = open ? 0.16 : highlighted ? 1 : 0.86;
  const positions: [number, number, number][] = [[-1.2, -1.15, 0.72], [1.62, -1.15, 0.72]];
  return (
    <group>
      {positions.map((position, index) => (
        <group key={index} position={position} rotation={[0, positive ? 0 : Math.PI, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.024, 0.024, 0.72, 12]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.34} transparent opacity={opacity} />
          </mesh>
          <mesh position={[0.38, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.09, 0.22, 16]} />
            <meshStandardMaterial color={color} transparent opacity={opacity} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Load({ brightness, open, highlighted }: { brightness: number; open: boolean; highlighted?: boolean }) {
  const glow = open ? 0 : brightness;
  return (
    <group position={[2.55, -1.15, 0.76]}>
      <mesh>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color="#fde68a" transparent opacity={0.38 + glow * 0.5} emissive="#facc15" emissiveIntensity={0.16 + glow * 1.8 + (highlighted ? 0.12 : 0)} />
      </mesh>
      <pointLight color="#facc15" intensity={glow * 2.1} distance={3} />
      <mesh position={[0, -0.34, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.16, 20]} />
        <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  );
}

function WireCircuit({ open, highlighted }: { open: boolean; highlighted?: boolean }) {
  return (
    <group>
      <mesh position={[1.9, -1.15, 0.62]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 1.25, 10]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={open ? 0.3 : 1} emissive={highlighted ? "#22c55e" : "#000000"} emissiveIntensity={0.12} />
      </mesh>
      <mesh position={[2.55, -1.45, 0.62]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <torusGeometry args={[0.58, 0.022, 8, 64, Math.PI]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={open ? 0.3 : 1} />
      </mesh>
    </group>
  );
}

function FormulaPanel({ visible, primaryTurns, secondaryTurns }: { visible: boolean; primaryTurns: number; secondaryTurns: number }) {
  if (!visible) return null;
  const ratio = secondaryTurns / Math.max(1, primaryTurns);
  return (
    <Html position={[0, 1.5, -1.1]} transform distanceFactor={6}>
      <div className="w-64 rounded-lg border border-white/15 bg-slate-950/92 p-3 text-[11px] text-white shadow-xl">
        <p className="font-semibold text-sky-300">Transformer equations</p>
        <p className="mt-1 font-mono">Vs / Vp ~= Ns / Np</p>
        <p className="font-mono">epsilon = -N dPhi/dt</p>
        <p className="font-mono">Is = Vs / R</p>
        <p className="mt-2 text-slate-300">turn ratio {ratio.toFixed(2)}: {ratio >= 1 ? "step-up" : "step-down"}</p>
      </div>
    </Html>
  );
}

function TransformerModel(props: Transformer3DProps) {
  const {
    phase,
    setPhase,
    frequency,
    primaryTurns,
    secondaryTurns,
    coupling,
    loadBrightness,
    toggles,
    failureMode,
    activeObjectIds
  } = props;
  const active = useMemo(() => new Set(activeObjectIds), [activeObjectIds]);
  const noInput = failureMode === "no-ac-input";
  const open = failureMode === "open-secondary";
  const weak = failureMode === "weak-coupling";
  const effectiveCoupling = weak ? coupling * 0.18 : coupling;

  useFrame((_, delta) => {
    if (toggles.playing && !noInput) setPhase((value) => (value + frequency * delta * Math.PI) % (Math.PI * 2));
  });

  return (
    <group>
      <Core exploded={toggles.exploded} cutaway={toggles.cutaway} highlighted={active.has("iron-core")} weak={weak} />
      <Coil x={toggles.exploded ? -1.62 : -1.25} turns={primaryTurns} highlighted={active.has("primary-coil")} />
      <Coil x={toggles.exploded ? 1.62 : 1.25} turns={secondaryTurns} highlighted={active.has("secondary-coil")} />
      <FluxPulse visible={toggles.fieldLines} phase={phase} coupling={effectiveCoupling} highlighted={active.has("flux-lines")} />
      <WireCircuit open={open} highlighted={active.has("load") || active.has("current-arrows")} />
      <CurrentArrows phase={phase} visible={toggles.currentArrows} open={open} highlighted={active.has("current-arrows")} />
      <Load brightness={loadBrightness} open={open || noInput} highlighted={active.has("load")} />
      <FormulaPanel visible={toggles.formula} primaryTurns={primaryTurns} secondaryTurns={secondaryTurns} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.35, -1.72, 0]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.84} />
      </mesh>

      {noInput ? <Label position={[-1.25, 0.92, 0]}>No AC input: flux is not changing</Label> : null}
      {open ? <Label position={[2.1, -1.55, 0.9]}>Open secondary: no load current</Label> : null}
      {weak ? <Label position={[0, 0.92, 0.2]}>Weak coupling: flux leaks away</Label> : null}

      {toggles.labels ? (
        <>
          <Label position={[-1.25, 1.08, 0]}>Primary coil Np</Label>
          <Label position={[0, 1.08, 0]}>Magnetic core</Label>
          <Label position={[1.25, 1.08, 0]}>Secondary coil Ns</Label>
          <Label position={[2.55, -1.78, 0.78]}>Load R</Label>
        </>
      ) : null}

      <Text position={[-1.25, -0.95, 0.1]} fontSize={0.16} color="#38bdf8" anchorX="center">AC input</Text>
      <Text position={[1.25, -0.95, 0.1]} fontSize={0.16} color="#22c55e" anchorX="center">AC output</Text>
    </group>
  );
}

export function Transformer3D(props: Transformer3DProps) {
  return (
    <Interactive3DViewport caption="Orbit, zoom and pan are enabled. Explode separates coils from core; cutaway makes the core translucent.">
      <Canvas camera={{ position: [4.4, 2.8, 5], fov: 48 }}>
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.72} />
        <directionalLight position={[4, 5, 5]} intensity={1.4} />
        <pointLight position={[-3, 2, -2]} intensity={0.5} />
        <TransformerModel {...props} />
        <CameraControls signal={props.resetCameraSignal} autoRotate={props.toggles.autoRotate} />
      </Canvas>
    </Interactive3DViewport>
  );
}
