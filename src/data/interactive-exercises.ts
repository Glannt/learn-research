import type { InteractiveSimulationExercise } from "@/types";

export const interactiveExercises: InteractiveSimulationExercise[] = [
  {
    id: "kinematics-100m-10s",
    simulationId: "kinematics",
    title: "Make the car travel 100 m in 10 s",
    prompt: "Set velocity and run the simulation so the car reaches 100 m in 10 s.",
    level: 3,
    requiredActions: ["Set v0 = 10 m/s", "Set acceleration near 0", "Run to 10 s", "Use s = v t"],
    validation: {
      expectedParameters: { initialVelocity: 10, acceleration: 0 },
      tolerance: { initialVelocity: 0.5, acceleration: 0.5, distance: 5 },
      expectedFormulaTokens: ["s", "v", "t"],
      expectedUnits: { distance: "m", velocity: "m/s", time: "s" },
      expectedOutcome: { distance: 100 }
    },
    explanation: "For uniform motion, s = v t, so v = 100 / 10 = 10 m/s."
  },
  {
    id: "kinematics-acceleration-20ms",
    simulationId: "kinematics",
    title: "Accelerate from 0 to 20 m/s in 5 s",
    prompt: "Set acceleration so the velocity-time graph reaches 20 m/s at 5 s.",
    level: 3,
    requiredActions: ["Set v0 = 0", "Set t = 5 s", "Set a = 4 m/s2", "Run the simulation"],
    validation: {
      expectedParameters: { initialVelocity: 0, acceleration: 4, time: 5 },
      tolerance: { initialVelocity: 0.2, acceleration: 0.2, time: 0.2, finalVelocity: 1 },
      expectedFormulaTokens: ["a", "delta v", "delta t"],
      expectedUnits: { acceleration: "m/s2" },
      expectedOutcome: { finalVelocity: 20 }
    },
    explanation: "a = delta v / delta t = (20 - 0) / 5 = 4 m/s2."
  },
  {
    id: "pendulum-longer-period",
    simulationId: "pendulum",
    title: "Increase the pendulum period",
    prompt: "Increase string length and verify that period becomes larger.",
    level: 2,
    requiredActions: ["Increase length above 1.5 m", "Run the pendulum", "Compare period"],
    validation: {
      expectedParameters: { length: 1.5 },
      tolerance: { length: 0.1, period: 0.2 },
      expectedFormulaTokens: ["T", "l", "g"],
      expectedUnits: { period: "s" },
      expectedOutcome: { period: 2.45 }
    },
    explanation: "T = 2pi sqrt(l/g), so period increases with the square root of length."
  },
  {
    id: "bonding-h2o",
    simulationId: "chemical-bonding",
    title: "Create water from 2 H and 1 O",
    prompt: "Drag two H atoms and one O atom into the bonding area.",
    level: 3,
    requiredActions: ["Drop H", "Drop H", "Drop O", "Check covalent O-H bonds"],
    validation: {
      expectedFormulaTokens: ["H", "H", "O"],
      expectedOutcome: { moleculeFormula: "H2O" }
    },
    explanation: "Oxygen shares one electron pair with each hydrogen, forming H2O."
  },
  {
    id: "reaction-neutralization",
    simulationId: "reaction-sandbox",
    title: "Neutralize acid and base",
    prompt: "Drag HCl and NaOH into the vessel, then start the reaction.",
    level: 3,
    requiredActions: ["Drop HCl", "Drop NaOH", "Start reaction", "Read balanced equation"],
    validation: {
      expectedOutcome: { productFormula: ["NaCl", "H2O"], balancedEquation: "HCl + NaOH -> NaCl + H2O" }
    },
    explanation: "H+ combines with OH- to form water; Na+ and Cl- remain as salt ions."
  }
];
