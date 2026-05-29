export function LampBrightnessIndicator({ brightness, highlighted }: { brightness: number; highlighted?: boolean }) {
  const glow = highlighted ? Math.min(1, brightness + 0.15) : brightness;
  return (
    <group position={[0, -2.2, 1.75]}>
      <mesh>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color="#fde68a" transparent opacity={0.42 + glow * 0.45} emissive="#facc15" emissiveIntensity={0.2 + glow * 1.8} />
      </mesh>
      <pointLight color="#facc15" intensity={glow * 2.3} distance={3.4} />
      <mesh position={[0, -0.34, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.16, 20]} />
        <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  );
}
