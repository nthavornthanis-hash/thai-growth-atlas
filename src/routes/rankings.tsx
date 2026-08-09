import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Search, ArrowUpDown } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useI18n } from "@/lib/i18n";
import { fmtTHB, useZones, type Zone } from "@/lib/zones";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { scoreColor } from "@/lib/score-color";

export const Route = createFileRoute("/rankings")({
  head: () => ({
    meta: [
      { title: "Top Emerging Rankings — Geo-Smart Location Analysis" },
      {
        name: "description",
        content:
          "Ranked table of Thailand's highest-potential sub-districts by potential score, with search, sorting and CSV/JSON export.",
      },
      { property: "og:title", content: "Top Emerging Rankings" },
      {
        property: "og:description",
        content: "Which Thai sub-districts score highest as emerging economic zones?",
      },
    ],
  }),
  component: Rankings,
});

type SortKey = "potential" | "avgAppraisal" | "poiCount";

function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function Rankings() {
  const { t, lang } = useI18n();
  const th = lang === "th";
  const { data, isLoading } = useZones();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("potential");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (data?.zones ?? [])
      .filter((z) =>
        term
          ? [z.tumbonTh, z.tumbonEn, z.amphurTh, z.amphurEn, z.changwatTh, z.changwatEn]
              .join(" ")
              .toLowerCase()
              .includes(term)
          : true,
      )
      .sort((a, b) => b[sort] - a[sort]);
  }, [data, q, sort]);

  const exportRows = (zs: Zone[]) =>
    zs.map((z, i) => ({
      rank: i + 1,
      tumbon: z.tumbonEn,
      amphur: z.amphurEn,
      changwat: z.changwatEn,
      potential_score: Number(z.potential.toFixed(2)),
      avg_evaprice: Math.round(z.avgAppraisal),
      poi_count: z.poiCount,
      road_distance_m: z.roadDistanceM,
      population_density: z.populationDensity,
      theos2_new_buildings: z.urbanNewBuildings,
    }));

  const chartData = rows.slice(0, 10).map((z) => ({
    name: th ? z.tumbonTh : z.tumbonEn,
    score: Number(z.potential.toFixed(1)),
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t("rank_title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("showing")} {rows.length} {t("zones_unit")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              const data = exportRows(rows);
              const header = Object.keys(data[0] ?? {}).join(",");
              const body = data.map((r) => Object.values(r).join(",")).join("\n");
              download("geo-smart-rankings.csv", `${header}\n${body}`, "text/csv");
            }}
          >
            <Download className="size-4" /> {t("export_csv")}
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              download(
                "geo-smart-rankings.json",
                JSON.stringify(exportRows(rows), null, 2),
                "application/json",
              )
            }
          >
            <Download className="size-4" /> {t("export_json")}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <h2 className="mb-4 text-sm font-semibold">{t("top10")}</h2>
          <div className="h-72">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis
                    dataKey="name"
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                  <RTooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      color: "var(--color-card-foreground)",
                    }}
                  />
                  <Bar dataKey="score" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="relative mb-4 max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("search")}
              className="pl-9"
            />
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                    <th className="p-3">{t("th_rank")}</th>
                    <th className="p-3">{t("th_tumbon")}</th>
                    <th className="p-3">{t("th_amphur")}</th>
                    <th className="p-3">{t("th_changwat")}</th>
                    <th className="cursor-pointer p-3" onClick={() => setSort("avgAppraisal")}>
                      <span className="inline-flex items-center gap-1">
                        {t("th_price")} <ArrowUpDown className="size-3" />
                      </span>
                    </th>
                    <th className="cursor-pointer p-3" onClick={() => setSort("potential")}>
                      <span className="inline-flex items-center gap-1">
                        {t("th_score")} <ArrowUpDown className="size-3" />
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((z, i) => (
                    <tr key={z.id} className="border-b border-border/60 hover:bg-muted/50">
                      <td className="p-3 text-muted-foreground">{i + 1}</td>
                      <td className="p-3 font-medium">{th ? z.tumbonTh : z.tumbonEn}</td>
                      <td className="p-3 text-muted-foreground">{th ? z.amphurTh : z.amphurEn}</td>
                      <td className="p-3 text-muted-foreground">
                        {th ? z.changwatTh : z.changwatEn}
                      </td>
                      <td className="p-3">{fmtTHB(z.avgAppraisal)}</td>
                      <td className="p-3">
                        <span
                          className="rounded-md px-2 py-1 text-xs font-semibold text-white"
                          style={{ backgroundColor: scoreColor(z.potential) }}
                        >
                          {z.potential.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}