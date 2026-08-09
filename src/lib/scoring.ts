export const NORMALIZATION = {
  urban: { min: 0, max: 150 },
  road: { min: 0, max: 5000 },
  poi: { min: 0, max: 50 },
  population: { min: 30, max: 4000 },
  appraisal: { min: 25, max: 120000 },
} as const;

export const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

export const minMax = (value: number, min: number, max: number) =>
  clamp(((value - min) / (max - min)) * 100);

export const inverseMinMax = (value: number, min: number, max: number) =>
  clamp(100 - ((value - min) / (max - min)) * 100);

export interface FactorInputs {
  urbanNewBuildings: number;
  roadDistanceM: number;
  poiCount: number;
  populationDensity: number;
  avgAppraisal: number;
}

export interface FactorScores {
  urban: number;
  road: number;
  poi: number;
  population: number;
  appraisal: number;
}

export function computeFactorScores(i: FactorInputs): FactorScores {
  return {
    urban: minMax(i.urbanNewBuildings, NORMALIZATION.urban.min, NORMALIZATION.urban.max),
    road: inverseMinMax(i.roadDistanceM, NORMALIZATION.road.min, NORMALIZATION.road.max),
    poi: minMax(i.poiCount, NORMALIZATION.poi.min, NORMALIZATION.poi.max),
    population: minMax(
      i.populationDensity,
      NORMALIZATION.population.min,
      NORMALIZATION.population.max,
    ),
    appraisal: minMax(i.avgAppraisal, NORMALIZATION.appraisal.min, NORMALIZATION.appraisal.max),
  };
}

export const WEIGHT = 0.2;

export function computePotentialScore(s: FactorScores): number {
  return (s.urban + s.road + s.poi + s.population + s.appraisal) * WEIGHT;
}