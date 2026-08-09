import { createFileRoute } from "@tanstack/react-router";
import { Building2, Route as RouteIcon, Store, Users, Landmark } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { NORMALIZATION } from "@/lib/scoring";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/methodology")({
  head: () => ({
    meta: [
      { title: "Methodology & Pipeline — Geo-Smart Location Analysis" },
      {
        name: "description",
        content:
          "Transparent spatial analytics pipeline: Min-Max normalization across five equally weighted factors producing a 0-100 potential score.",
      },
      { property: "og:title", content: "Methodology & Pipeline" },
      {
        property: "og:description",
        content: "How the unbiased 5-factor, 20%-each potential score is computed.",
      },
    ],
  }),
  component: Methodology,
});

function Methodology() {
  const { t } = useI18n();
  const factors = [
    {
      icon: Building2,
      name: "Urban Expansion Rate — THEOS-2 AI Layer",
      formula: `Score = (newBuildings - ${NORMALIZATION.urban.min}) / (${NORMALIZATION.urban.max} - ${NORMALIZATION.urban.min}) × 100`,
    },
    {
      icon: RouteIcon,
      name: "Road Network Proximity — Sphere Transport API",
      formula: `Score = 100 - [(distance_m - 0) / (5000 - 0) × 100]`,
    },
    {
      icon: Store,
      name: "Commercial POI Density — Sphere POI API (2 km)",
      formula: `Score = (poiCount - 0) / (50 - 0) × 100`,
    },
    {
      icon: Users,
      name: "Population Density — Sphere Demographics API",
      formula: `Score = (density - 30) / (4000 - 30) × 100`,
    },
    {
      icon: Landmark,
      name: "Land Appraisal Value — CSV Average EVAPRICE",
      formula: `Score = (avgEVAPRICE - 25) / (120000 - 25) × 100`,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-4 py-12">
      <header>
        <h1 className="text-3xl font-semibold">{t("method_title")}</h1>
        <p className="mt-3 text-muted-foreground">{t("method_intro")}</p>
      </header>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Spatial Analytics Pipeline
          </h2>
          <ol className="mt-4 space-y-3 text-sm">
            {[
              "Ingest attach_all_20240805.csv via PapaParse (streamed in the browser).",
              "Group parcels by TUMBON_NAME + AMPHUR_NAME + CHANGWAT_NAME and average EVAPRICE.",
              "Fetch Sphere Transport / POI / Demographics metrics per zone (local cache fallback).",
              "Overlay THEOS-2 AI detected new-building footprints.",
              "Min-Max normalize each factor to 0–100 and apply equal 20% weights.",
              "Render heatmap, rankings and per-zone radar breakdown.",
            ].map((s, i) => (
              <li key={s} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <span className="text-muted-foreground">{s}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {factors.map((f) => (
          <Card key={f.name}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <f.icon className="size-4" />
                </span>
                <h3 className="text-sm font-semibold">{f.name}</h3>
                <span className="ml-auto rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                  20%
                </span>
              </div>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-3 text-xs">
                {f.formula}
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-sm font-semibold">Total Potential Score</h2>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-3 text-xs">
            {`Potential = (S1 × 0.2) + (S2 × 0.2) + (S3 × 0.2) + (S4 × 0.2) + (S5 × 0.2)`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}