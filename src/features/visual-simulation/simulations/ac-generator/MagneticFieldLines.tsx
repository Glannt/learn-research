import * as THREE from "three";

export function MagneticFieldLines({
  strength,
  visible,
  highlighted
}: {
  strength: number;
  visible: boolean;
  highlighted?: boolean;
}) {
  if (!visible) return null;
  const lines = Math.max(3, Math.round(3 + strength * 4));
  return (
    <group>
      {Array.from({ length: lines }, (_, index) => {
        const y = -0.9 + (index / Math.max(1, lines - 1)) * 1.8;
        const opacity = highlighted ? 0.95 : 0.68;
        return (
          <group key={index} position={[0, y, -0.62]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.018, 0.018, 3.6, 10]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={highlighted ? 0.55 : 0.25} transparent opacity={opacity} />
            </mesh>
            <mesh position={[1.88, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.08, 0.22, 16]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.35} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function RotationArrow({ visible = true, highlighted }: { visible?: boolean; highlighted?: boolean }) {
  if (!visible) return null;
  const curve = new THREE.EllipseCurve(0, 0, 0.78, 0.78, Math.PI * 0.15, Math.PI * 1.65, false);
  const points = curve.getPoints(48).map((point) => new THREE.Vector3(point.x, point.y, 0));
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return (
    <group position={[0, 1.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <line>
        <primitive object={geometry} attach="geometry" />
        <lineBasicMaterial color={highlighted ? "#fb923c" : "#f97316"} linewidth={3} />
      </line>
      <mesh position={[-0.68, -0.37, 0]} rotation={[0, 0, -0.85]}>
        <coneGeometry args={[0.09, 0.24, 18]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={highlighted ? 0.35 : 0.15} />
      </mesh>
    </group>
  );
}
