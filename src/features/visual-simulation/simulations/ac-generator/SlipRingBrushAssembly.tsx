export function SlipRingBrushAssembly({
  exploded,
  failureMode,
  highlighted
}: {
  exploded: boolean;
  failureMode: string;
  highlighted?: boolean;
}) {
  const brushColor = failureMode === "brush-disconnected" ? "#ef4444" : "#1f2937";
  const ringEmissive = highlighted ? 0.32 : 0.06;
  return (
    <group position={[0, exploded ? -0.35 : 0, 0]}>
      <mesh position={[0, -1.08, -0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.2, 0.035, 12, 32]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.24} emissive="#f59e0b" emissiveIntensity={ringEmissive} />
      </mesh>
      <mesh position={[0, -1.08, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.2, 0.035, 12, 32]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.24} emissive="#f59e0b" emissiveIntensity={ringEmissive} />
      </mesh>
      <mesh position={[-0.42, failureMode === "brush-disconnected" ? -1.62 : -1.42, -0.35]}>
        <boxGeometry args={[0.38, 0.12, 0.16]} />
        <meshStandardMaterial color={brushColor} emissive={failureMode === "brush-disconnected" ? "#ef4444" : "#000000"} emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0.42, failureMode === "brush-disconnected" ? -1.62 : -1.42, 0.35]}>
        <boxGeometry args={[0.38, 0.12, 0.16]} />
        <meshStandardMaterial color={brushColor} emissive={failureMode === "brush-disconnected" ? "#ef4444" : "#000000"} emissiveIntensity={0.25} />
      </mesh>
    </group>
  );
}
