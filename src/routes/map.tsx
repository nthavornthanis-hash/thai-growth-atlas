import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Layers, SlidersHorizontal } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { fmtTHB, useZones, type Zone } from "@/lib/zones";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ZoneDetail } from "@/components/ZoneDetail";
import type { LayerState } from "@/components/MapView";

const MapView = lazy(() => import("@/components/MapView"));

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Interactive Map Dashboard — Geo-Smart Location Analysis" },
      {
        name: "description",
        content:
          "Two-tier GIS dashboard: Thailand macro heatmap and Phuket micro view with THEOS-2 AI layer, POI, roads and land appraisal values.",
      },
      { property: "og:title", content: "Interactive Map Dashboard" },
      {
        property: "og:description",
        content: "Explore potential scores by sub-district across Thailand and Phuket.",
      },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const { t, lang } = useI18n();
  const { data, isLoading } = useZones();
  const [view, setView] = useState<"macro" | "micro">("micro");
  const [selected, setSelected] = useState<Zone | null>(null);
  const [scoreRange, setScoreRange] = useState<number[]>([0, 100]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 120000]);
  const [mounted, setMounted] = useState(false);
  const [layers, setLayers] = useState<LayerState>({
    heatmap: true,
    theos: true,
    roads: true,
    poi: true,
    population: false,
    price: false,
  });

  useEffect(() => setMounted(true), []);

  const zones = useMemo(
    () =>
      (data?.zones ?? []).filter(
        (z) =>
          z.potential >= scoreRange[0] &&
          z.potential <= scoreRange[1] &&
          z.avgAppraisal >= priceRange[0] &&
          z.avgAppraisal <= priceRange[1],
      ),
    [data, scoreRange, priceRange],
  );

  const toggles: { key: keyof LayerState; label: string }[] = [
    { key: "heatmap", label: t("l_heat") },
    { key: "theos", label: t("l_theos") },
    { key: "roads", label: t("l_road") },
    { key: "poi", label: t("l_poi") },
    { key: "population", label: t("l_pop") },
    { key: "price", label: t("l_price") },
  ];

  return (
    <div className="mx-auto grid max-w-[1600px] gap-4 p-4 lg:grid-cols-[300px_1fr]">
      <div className="space-y-4">
        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="grid grid-cols-2 gap-2">
              {(["macro", "micro"] as const).map((v) => (
                <Button
                  key={v}
                  size="sm"
                  variant={view === v ? "default" : "outline"}
                  onClick={() => setView(v)}
                >
                  {t(v)}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("showing")} {zones.length} {t("zones_unit")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Layers className="size-4 text-primary" /> {t("layers")}
            </h2>
            {toggles.map((l) => (
              <div key={l.key} className="flex items-center justify-between gap-2">
                <Label htmlFor={l.key} className="text-xs font-normal text-muted-foreground">
                  {l.label}
                </Label>
                <Switch
                  id={l.key}
                  checked={layers[l.key]}
                  onCheckedChange={(v) => setLayers((s) => ({ ...s, [l.key]: v }))}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-6 p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <SlidersHorizontal className="size-4 text-primary" /> {t("filters")}
            </h2>
            <div className="space-y-3">
              <Label className="text-xs text-muted-foreground">
                {t("f_score")}: {scoreRange[0]}–{scoreRange[1]}
              </Label>
              <Slider min={0} max={100} step={1} value={scoreRange} onValueChange={setScoreRange} />
            </div>
            <div className="space-y-3">
              <Label className="text-xs text-muted-foreground">
                {t("f_pricerange")}: {fmtTHB(priceRange[0])}–{fmtTHB(priceRange[1])}
              </Label>
              <Slider
                min={0}
                max={120000}
                step={1000}
                value={priceRange}
                onValueChange={setPriceRange}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="relative overflow-hidden p-0">
        <div className="relative h-[78vh] min-h-[520px] w-full">
          {isLoading || !mounted ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <Suspense fallback={<Skeleton className="h-full w-full" />}>
              <MapView
                zones={zones}
                view={view}
                layers={layers}
                selectedId={selected?.id}
                onSelect={setSelected}
              />
            </Suspense>
          )}
          {selected ? (
            <ZoneDetail zone={selected} onClose={() => setSelected(null)} />
          ) : (
            <div className="pointer-events-none absolute bottom-4 left-1/2 z-[1100] -translate-x-1/2 rounded-full border border-border bg-card/90 px-4 py-2 text-xs text-muted-foreground backdrop-blur">
              {t("pick_zone")}
            </div>
          )}
        </div>
      </Card>
      <span className="sr-only">{lang}</span>
    </div>
  );
}