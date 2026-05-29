import type { ChemicalElement } from "@/types";

export function moleFromMass(mass: number, molarMass: number) {
  return mass / molarMass;
}

export function molarity(moles: number, volumeLiters: number) {
  return moles / volumeLiters;
}

export function percentConcentration(soluteMass: number, solutionMass: number) {
  return (soluteMass / solutionMass) * 100;
}

export function phFromHydrogen(hydrogenConcentration: number) {
  return -Math.log10(hydrogenConcentration);
}

export function reactionRateByTemperature(baseRate: number, temperatureC: number) {
  const reference = 25;
  const q10 = 2;
  return baseRate * q10 ** ((temperatureC - reference) / 10);
}

export function electronShells(element: ChemicalElement) {
  const capacities = [2, 8, 8, 18, 18];
  let remaining = element.atomicNumber;
  return capacities
    .map((capacity) => {
      const value = Math.min(capacity, remaining);
      remaining -= value;
      return value;
    })
    .filter(Boolean);
}

export function bondingKind(elements: ChemicalElement[]) {
  const metalCategories = ["alkali metal", "alkaline earth metal", "post-transition metal"];
  const hasMetal = elements.some((element) => metalCategories.includes(element.category));
  const hasNonMetal = elements.some((element) => !metalCategories.includes(element.category));
  return hasMetal && hasNonMetal ? "Liên kết ion" : "Liên kết cộng hóa trị";
}
