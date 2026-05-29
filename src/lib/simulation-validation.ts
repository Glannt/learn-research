import type { SimulationExerciseValidation } from "@/types";

export type SimulationValidationInput = {
  parameters?: Record<string, number | string>;
  formulaTokens?: string[];
  units?: Record<string, string>;
  outcome?: {
    distance?: number;
    finalVelocity?: number;
    period?: number;
    moleculeFormula?: string;
    productFormula?: string[];
    balancedEquation?: string;
  };
};

export type SimulationValidationResult = {
  ok: boolean;
  score: number;
  messages: string[];
};

function closeEnough(actual: number, expected: number, tolerance = 0.001) {
  return Math.abs(actual - expected) <= tolerance;
}

export function validateSimulationExercise(validation: SimulationExerciseValidation, input: SimulationValidationInput): SimulationValidationResult {
  const messages: string[] = [];
  let checks = 0;
  let passed = 0;

  Object.entries(validation.expectedParameters ?? {}).forEach(([key, expected]) => {
    checks += 1;
    const actual = input.parameters?.[key];
    const tolerance = validation.tolerance?.[key] ?? 0.001;
    const ok = typeof expected === "number" && typeof actual === "number" ? closeEnough(actual, expected, tolerance) : actual === expected;
    if (ok) passed += 1;
    else messages.push(`Parameter ${key} should be ${expected}.`);
  });

  (validation.expectedFormulaTokens ?? []).forEach((token) => {
    checks += 1;
    const ok = input.formulaTokens?.map((item) => item.toLowerCase()).includes(token.toLowerCase());
    if (ok) passed += 1;
    else messages.push(`Missing formula token: ${token}.`);
  });

  Object.entries(validation.expectedUnits ?? {}).forEach(([key, expected]) => {
    checks += 1;
    const actual = input.units?.[key];
    const ok = actual?.trim().toLowerCase() === expected.trim().toLowerCase();
    if (ok) passed += 1;
    else messages.push(`Unit for ${key} should be ${expected}.`);
  });

  const expectedOutcome = validation.expectedOutcome;
  if (expectedOutcome?.distance !== undefined) {
    checks += 1;
    const ok = closeEnough(input.outcome?.distance ?? Number.NaN, expectedOutcome.distance, validation.tolerance?.distance ?? 1);
    if (ok) passed += 1;
    else messages.push(`Distance should be near ${expectedOutcome.distance}.`);
  }
  if (expectedOutcome?.finalVelocity !== undefined) {
    checks += 1;
    const ok = closeEnough(input.outcome?.finalVelocity ?? Number.NaN, expectedOutcome.finalVelocity, validation.tolerance?.finalVelocity ?? 1);
    if (ok) passed += 1;
    else messages.push(`Final velocity should be near ${expectedOutcome.finalVelocity}.`);
  }
  if (expectedOutcome?.period !== undefined) {
    checks += 1;
    const ok = (input.outcome?.period ?? 0) > expectedOutcome.period - (validation.tolerance?.period ?? 0.2);
    if (ok) passed += 1;
    else messages.push(`Period should be near or above ${expectedOutcome.period}.`);
  }
  if (expectedOutcome?.moleculeFormula) {
    checks += 1;
    const ok = input.outcome?.moleculeFormula === expectedOutcome.moleculeFormula;
    if (ok) passed += 1;
    else messages.push(`Molecule should be ${expectedOutcome.moleculeFormula}.`);
  }
  if (expectedOutcome?.productFormula) {
    checks += 1;
    const expected = expectedOutcome.productFormula.slice().sort().join("|");
    const actual = input.outcome?.productFormula?.slice().sort().join("|");
    if (actual === expected) passed += 1;
    else messages.push(`Products should be ${expectedOutcome.productFormula.join(" + ")}.`);
  }
  if (expectedOutcome?.balancedEquation) {
    checks += 1;
    if (input.outcome?.balancedEquation === expectedOutcome.balancedEquation) passed += 1;
    else messages.push(`Balanced equation should be ${expectedOutcome.balancedEquation}.`);
  }

  const score = checks ? Math.round((passed / checks) * 100) : 100;
  return { ok: score === 100, score, messages: messages.length ? messages : ["All checks passed."] };
}
