import { X } from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  PolarRadiusAxis,
} from "recharts";
import { useI18n } from "@/lib/i18n";
import { fmtTHB, type Zone } from "@/lib/zones";
import { Button } from "@/components/ui/button";
import { scoreColor } from "@/lib/score-color";

export function ZoneDetail({ zone, onClose }: { zone: Zone; onClose: () => void }) {
  const { t, lang } = useI18n();
  const th = lang === "th";
  const data = [
    { factor: t("f_urban"), value: zone.scores.urban },
    { factor: t("f_road"), value: zone.scores.road },
    { factor: t("f_poi"), value: zone.scores.poi },
    { factor: t("f_pop"), value: zone.scores.population },
    { factor: t("f_price"), value: zone.scores.appraisal },
  ];

  return (
    <aside className="absolute inset-y-0 right-0 z-[1200] w-full max-w-sm animate-in slide-in-from-right overflow-y-auto border-l border-border bg-card/95 backdrop-blur card-elevated">
      <div className="flex items-start justify-between gap-3 border-b border-border p-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("detail")}</p>
          <h3 className="text-lg font-semibold">{th ? zone.tumbonTh : zone.tumbonEn}</h3>
          <p className="text-sm text-muted-foreground">
            {th ? zone.amphurTh : zone.amphurEn} · {th ? zone.changwatTh : zone.changwatEn}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="close">
          <X className="size-4" />
        </Button>
      </div>

      <div className="space-y-5 p-4">
        <div className="rounded-xl border border-border p-4 text-center">
          <p className="text-xs text-muted-foreground">{t("score")}</p>
          <p className="text-5xl font-bold" style={{ color: scoreColor(zone.potential) }}>
            {zone.potential.toFixed(1)}
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full"
              style={{ width: `${zone.potential}%`, backgroundColor: scoreColor(zone.potential) }}
            />
          </div>
        </div>

        <div className="h-64 rounded-xl border border-border p-2">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} outerRadius="70%">
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis
                dataKey="factor"
                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
              />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                dataKey="value"
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
                fillOpacity={0.35}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <dl className="space-y-2 text-sm">
          {[
            [t("avg_price"), `${fmtTHB(zone.avgAppraisal)} ${t("baht_wah")}`],
            [t("poi_count"), `${zone.poiCount}`],
            [t("road_dist"), `${fmtTHB(zone.roadDistanceM)} m`],
            [t("pop_density"), `${fmtTHB(zone.populationDensity)} /km²`],
            [t("theos_new"), `${zone.urbanNewBuildings}`],
            [t("parcels"), `${zone.parcelCount}`],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </aside>
  );
}