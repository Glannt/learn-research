import type { ReactionSimulation } from "@/types";

export const reactionSimulations: ReactionSimulation[] = [
  {
    id: "water-formation",
    name: "Water formation",
    reactants: [
      { id: "h2", formula: "H2", name: "Hydrogen", phase: "gas", safetyNote: "Concept-only combustible gas." },
      { id: "o2", formula: "O2", name: "Oxygen", phase: "gas" }
    ],
    products: [{ id: "h2o", formula: "H2O", name: "Water", phase: "liquid" }],
    equation: "H2 + O2 -> H2O",
    balancedEquation: "2H2 + O2 -> 2H2O",
    requiredConditions: { temperatureRange: [20, 100] },
    bondChanges: {
      brokenBonds: [{ from: "H", to: "H", order: 1 }, { from: "O", to: "O", order: 2 }],
      formedBonds: [{ from: "O", to: "H", order: 1 }, { from: "O", to: "H", order: 1 }]
    },
    energyProfile: { type: "exothermic", activationEnergy: 8, deltaH: -6 },
    safetyLevel: "concept-only",
    explanation: "A conceptual collision model: old H-H and O=O bonds break, then O-H bonds form. No real procedure or mixture ratio is provided."
  },
  {
    id: "sodium-chloride",
    name: "Ionic sodium chloride",
    reactants: [
      { id: "na", formula: "Na", name: "Sodium", phase: "solid", safetyNote: "Concept-only reactive metal." },
      { id: "cl2", formula: "Cl2", name: "Chlorine", phase: "gas", safetyNote: "Concept-only toxic gas." }
    ],
    products: [{ id: "nacl", formula: "NaCl", name: "Sodium chloride", phase: "solid" }],
    equation: "Na + Cl -> NaCl",
    balancedEquation: "2Na + Cl2 -> 2NaCl",
    bondChanges: { brokenBonds: [{ from: "Cl", to: "Cl", order: 1 }], formedBonds: [{ from: "Na+", to: "Cl-", order: 1 }] },
    energyProfile: { type: "exothermic", activationEnergy: 6, deltaH: -5 },
    safetyLevel: "concept-only",
    explanation: "The animation focuses on electron transfer and ionic attraction only."
  },
  {
    id: "acid-base-neutralization",
    name: "Acid-base neutralization",
    reactants: [
      { id: "hcl", formula: "HCl", name: "Hydrochloric acid", phase: "aqueous" },
      { id: "naoh", formula: "NaOH", name: "Sodium hydroxide", phase: "aqueous" }
    ],
    products: [
      { id: "nacl", formula: "NaCl", name: "Sodium chloride", phase: "aqueous" },
      { id: "h2o", formula: "H2O", name: "Water", phase: "liquid" }
    ],
    equation: "HCl + NaOH -> NaCl + H2O",
    balancedEquation: "HCl + NaOH -> NaCl + H2O",
    bondChanges: { brokenBonds: [{ from: "H", to: "Cl", order: 1 }, { from: "Na", to: "OH", order: 1 }], formedBonds: [{ from: "H", to: "OH", order: 1 }, { from: "Na+", to: "Cl-", order: 1 }] },
    energyProfile: { type: "exothermic", activationEnergy: 3, deltaH: -2 },
    safetyLevel: "school-safe",
    explanation: "H+ and OH- combine into water while Na+ and Cl- remain as spectator ions in this simplified model."
  },
  {
    id: "silver-chloride-precipitation",
    name: "Silver chloride precipitation",
    reactants: [
      { id: "agno3", formula: "AgNO3", name: "Silver nitrate", phase: "aqueous" },
      { id: "nacl", formula: "NaCl", name: "Sodium chloride", phase: "aqueous" }
    ],
    products: [
      { id: "agcl", formula: "AgCl", name: "Silver chloride precipitate", phase: "solid" },
      { id: "nano3", formula: "NaNO3", name: "Sodium nitrate", phase: "aqueous" }
    ],
    equation: "AgNO3 + NaCl -> AgCl + NaNO3",
    balancedEquation: "AgNO3 + NaCl -> AgCl(s) + NaNO3",
    bondChanges: { brokenBonds: [{ from: "Ag+", to: "NO3-", order: 1 }, { from: "Na+", to: "Cl-", order: 1 }], formedBonds: [{ from: "Ag+", to: "Cl-", order: 1 }] },
    energyProfile: { type: "exothermic", activationEnergy: 2, deltaH: -1 },
    safetyLevel: "school-safe",
    explanation: "Ag+ and Cl- form an insoluble solid shown as precipitate particles."
  },
  {
    id: "calcium-carbonate-decomposition",
    name: "Calcium carbonate decomposition",
    reactants: [{ id: "caco3", formula: "CaCO3", name: "Calcium carbonate", phase: "solid" }],
    products: [
      { id: "cao", formula: "CaO", name: "Calcium oxide", phase: "solid" },
      { id: "co2", formula: "CO2", name: "Carbon dioxide", phase: "gas" }
    ],
    equation: "CaCO3 -> CaO + CO2",
    balancedEquation: "CaCO3 -> CaO + CO2",
    requiredConditions: { temperatureRange: [700, 1000] },
    bondChanges: { brokenBonds: [{ from: "Ca", to: "CO3", order: 1 }], formedBonds: [{ from: "C", to: "O", order: 2 }] },
    energyProfile: { type: "endothermic", activationEnergy: 9, deltaH: 5 },
    safetyLevel: "concept-only",
    explanation: "Heat input is shown conceptually; this is not a lab procedure."
  },
  {
    id: "methane-combustion",
    name: "Methane combustion",
    reactants: [
      { id: "ch4", formula: "CH4", name: "Methane", phase: "gas", safetyNote: "Concept-only fuel gas." },
      { id: "o2", formula: "O2", name: "Oxygen", phase: "gas" }
    ],
    products: [
      { id: "co2", formula: "CO2", name: "Carbon dioxide", phase: "gas" },
      { id: "h2o", formula: "H2O", name: "Water", phase: "gas" }
    ],
    equation: "CH4 + O2 -> CO2 + H2O",
    balancedEquation: "CH4 + 2O2 -> CO2 + 2H2O",
    bondChanges: { brokenBonds: [{ from: "C", to: "H", order: 1 }, { from: "O", to: "O", order: 2 }], formedBonds: [{ from: "C", to: "O", order: 2 }, { from: "O", to: "H", order: 1 }] },
    energyProfile: { type: "exothermic", activationEnergy: 8, deltaH: -8 },
    safetyLevel: "concept-only",
    explanation: "Combustion is represented as a safe energy diagram and molecule rearrangement only."
  }
];
