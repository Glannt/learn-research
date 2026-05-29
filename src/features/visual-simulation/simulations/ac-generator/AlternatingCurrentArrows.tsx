export function AlternatingCurrentArrows({
  current,
  visible,
  failureMode,
  highlighted
}: {
  current: number;
  visible: boolean;
  failureMode: string;
  highlighted?: boolean;
}) {
  if (!visible) return null;
  const direction = current >= 0 ? 1 : -1;
  const opacity = failureMode === "brush-disconnected" ? 0.16 : highlighted ? 1 : 0.86;
  const color = direction > 0 ? "#22c55e" : "#fb7185";
  const emissive = direction > 0 ? "#16a34a" : "#e11d48";
  const positions: [number, number, number][] = [[-0.55, -1.66, 1.18], [0.55, -1.66, 1.18]];

  return (
    <group>
      {positions.map((position, index) => (
        <group key={index} position={position} rotation={[0, direction > 0 ? 0 : Math.PI, 0]}>
          <mesh position={[0.24, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.58, 12]} />
            <meshStandardMaterial color={color} transparent opacity={opacity} emissive={emissive} emissiveIntensity={0.42} />
          </mesh>
          <mesh position={[0.56, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.1, 0.26, 18]} />
            <meshStandardMaterial color={color} transparent opacity={opacity} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
