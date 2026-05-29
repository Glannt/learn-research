import { idealGasPressure, kinematicsState, newtonLawState, pendulumPeriod } from "@/lib/physics/calculations";
import { molarity, moleFromMass, percentConcentration, phFromHydrogen } from "@/lib/chemistry/calculations";

export type FormulaInputs = Record<string, number>;

export function evaluateFormula(operationId: string, inputs: FormulaInputs) {
  switch (operationId) {
    case "velocity":
      return inputs.s / inputs.t;
    case "acceleration":
      return (inputs.v - inputs.v0) / inputs.t;
    case "kinematics-distance":
      return kinematicsState({
        initialPosition: 0,
        initialVelocity: inputs.v0,
        acceleration: inputs.a,
        time: inputs.t
      }).position;
    case "newton-force":
      return inputs.m * inputs.a;
    case "work":
      return inputs.F * inputs.s * Math.cos((inputs.theta * Math.PI) / 180);
    case "power":
      return inputs.A / inputs.t;
    case "kinetic-energy":
      return 0.5 * inputs.m * inputs.v ** 2;
    case "potential-energy":
      return inputs.m * inputs.g * inputs.h;
    case "momentum":
      return inputs.m * inputs.v;
    case "pendulum-period":
      return pendulumPeriod(inputs.l, inputs.g);
    case "ideal-gas-pressure":
      return idealGasPressure({ n: inputs.n, temperature: inputs.T, volume: inputs.V });
    case "ohm-current":
      return inputs.U / inputs.R;
    case "electric-power":
      return inputs.U * inputs.I;
    case "capacitance":
      return inputs.q / inputs.U;
    case "electric-field":
      return inputs.F / inputs.q;
    case "mole":
      return moleFromMass(inputs.m, inputs.M);
    case "molarity":
      return molarity(inputs.n, inputs.V);
    case "percent-concentration":
      return percentConcentration(inputs.mct, inputs.mdd);
    case "density":
      return inputs.m / inputs.V;
    case "ph":
      return phFromHydrogen(inputs.H);
    case "mass-from-mole":
      return inputs.n * inputs.M;
    case "gas-volume-stp":
      return inputs.n * 22.4;
    case "yield-percent":
      return (inputs.actual / inputs.theory) * 100;
    case "newton-law-demo":
      return newtonLawState({
        mass: inputs.m,
        force: inputs.F,
        friction: inputs.mu,
        angleDeg: inputs.theta
      }).acceleration;
    default:
      throw new Error(`Formula operation is not implemented: ${operationId}`);
  }
}
