import { useQuery } from "@tanstack/react-query";
import Papa from "papaparse";
import tambons from "@/data/tambons.json";
import { computeFactorScores, computePotentialScore, type FactorScores } from "./scoring";

export interface TambonMeta {
  id: string;
  tumbonTh: string;
  tumbonEn: string;
  amphurTh: string;
  amphurEn: string;
  changwatTh: string;
  changwatEn: string;
  lat: number;
  lon: number;
  phuket: boolean;
  urbanNewBuildings: number;
  roadDistanceM: number;
  poiCount: number;
  populationDensity: number;
}

export interface Zone extends TambonMeta {
  avgAppraisal: number;
  parcelCount: number;
  scores: FactorScores;
  potential: number;
}

interface CsvRow {
  CHANGWAT_NAME_EN?: string;
  AMPHUR_NAME_EN?: string;
  TUMBON_NAME_EN?: string;
  EVAPRICE?: string | number;
}

const META = tambons as TambonMeta[];

/** Group parcels by TUMBON_NAME (with AMPHUR/CHANGWAT) and average EVAPRICE. */
export function groupByTumbon(rows: CsvRow[]) {
  const acc = new Map<string, { sum: number; n: number }>();
  for (const r of rows) {
    const price = Number(r.EVAPRICE);
    if (!r.TUMBON_NAME_EN || !Number.isFinite(price)) continue;
    const key = `${r.TUMBON_NAME_EN}|${r.AMPHUR_NAME_EN}|${r.CHANGWAT_NAME_EN}`.toLowerCase();
    const cur = acc.get(key) ?? { sum: 0, n: 0 };
    cur.sum += price;
    cur.n += 1;
    acc.set(key, cur);
  }
  return acc;
}

function buildZones(acc: Map<string, { sum: number; n: number }>): Zone[] {
  return META.map((m) => {
    const hit = acc.get(`${m.tumbonEn}|${m.amphurEn}|${m.changwatEn}`.toLowerCase());
    const avgAppraisal = hit ? hit.sum / hit.n : 0;
    const scores = computeFactorScores({
      urbanNewBuildings: m.urbanNewBuildings,
      roadDistanceM: m.roadDistanceM,
      poiCount: m.poiCount,
      populationDensity: m.populationDensity,
      avgAppraisal,
    });
    return {
      ...m,
      avgAppraisal,
      parcelCount: hit?.n ?? 0,
      scores,
      potential: computePotentialScore(scores),
    };
  }).sort((a, b) => b.potential - a.potential);
}

async function loadZones(): Promise<{ zones: Zone[]; parcels: number; usedFallback: boolean }> {
  try {
    const res = await fetch("/attach_all_20240805.csv");
    if (!res.ok) throw new Error(`CSV ${res.status}`);
    const text = await res.text();
    const parsed = Papa.parse<CsvRow>(text, { header: true, skipEmptyLines: true });
    const acc = groupByTumbon(parsed.data);
    let parcels = 0;
    acc.forEach((v) => (parcels += v.n));
    return { zones: buildZones(acc), parcels, usedFallback: false };
  } catch {
    // Fallback: render the dashboard from local cached metadata only.
    return { zones: buildZones(new Map()), parcels: 0, usedFallback: true };
  }
}

export function useZones() {
  return useQuery({ queryKey: ["zones"], queryFn: loadZones, staleTime: Infinity });
}

export const fmtTHB = (n: number) =>
  new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(Math.round(n));