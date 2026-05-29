import type { ReactionSimulation } from "@/types";

export function ReactionEnergyProfile({ reaction }: { reaction: ReactionSimulation }) {
  const endY = reaction.energyProfile.type === "exothermic" ? 220 : 110;
  return (
    <svg viewBox="0 0 520 260" className="h-56 w-full rounded-md border border-border bg-card">
      <line x1="50" y1="220" x2="490" y2="220" stroke="#94a3b8" />
      <line x1="50" y1="30" x2="50" y2="220" stroke="#94a3b8" />
      <text x="18" y="36" fill="currentColor" fontSize="12">E</text>
      <text x="452" y="244" fill="currentColor" fontSize="12">reaction</text>
      <path d={`M70 170 C160 ${40 + reaction.energyProfile.activationEnergy * 5} 230 ${40 + reaction.energyProfile.activationEnergy * 3} 285 72 S390 ${endY} 460 ${endY}`} fill="none" stroke={reaction.energyProfile.type === "exothermic" ? "#22c55e" : "#f97316"} strokeWidth="4" />
      <text x="80" y="160" fill="currentColor" fontSize="13">reactants</text>
      <text x="386" y={endY - 12} fill="currentColor" fontSize="13">products</text>
      <text x="190" y="58" fill="currentColor" fontSize="13">Ea {reaction.energyProfile.activationEnergy}</text>
      <text x="210" y="238" fill="currentColor" fontSize="13">{reaction.energyProfile.type}, deltaH {reaction.energyProfile.deltaH}</text>
    </svg>
  );
}
