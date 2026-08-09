import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Database, Cpu, Gauge, Satellite, MapPinned } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useZones } from "@/lib/zones";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Geo-Smart Location Analysis — Thailand Emerging Zones" },
      {
        name: "description",
        content:
          "Analyze and forecast Thailand's emerging economic zones with THEOS-2 satellite AI, GISTDA Sphere API and land appraisal data. Pilot area: Phuket.",
      },
      { property: "og:title", content: "Geo-Smart Location Analysis" },
      {
        property: "og:description",
        content: "THEOS-2 + GISTDA Sphere powered emerging economic zone intelligence for Thailand.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useI18n();
  const { data, isLoading } = useZones();

  const steps = [
    { icon: Database, title: t("step1"), body: t("step1d") },
    { icon: Cpu, title: t("step2"), body: t("step2d") },
    { icon: Gauge, title: t("step3"), body: t("step3d") },
  ];

  return (
    <div>
      <section className="hero-surface relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-24 text-center md:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs text-slate-100">
            <Satellite className="size-3.5" /> {t("hero_tag")}
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight text-slate-50 md:text-6xl">
            {t("hero_title")}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-300 md:text-lg">
            {t("hero_sub")}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/map">
                {t("cta")} <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/5">
              <Link to="/methodology">{t("cta2")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-10 grid max-w-5xl gap-4 px-4 sm:grid-cols-3">
        {[
          { label: t("stat_zones"), value: data?.zones.length },
          { label: t("stat_parcels"), value: data?.parcels },
          { label: t("stat_factors"), value: 5 },
        ].map((s) => (
          <Card key={s.label} className="card-elevated">
            <CardContent className="p-6 text-center">
              {isLoading ? (
                <Skeleton className="mx-auto h-8 w-20" />
              ) : (
                <div className="text-3xl font-bold text-primary">{s.value ?? 0}</div>
              )}
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="text-center text-2xl font-semibold">{t("pipeline")}</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <Card key={s.title} className="group relative overflow-hidden transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <s.icon className="size-5" />
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    STEP {i + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-10">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div className="flex items-center gap-3">
              <MapPinned className="size-5 text-primary" />
              <p className="text-sm text-muted-foreground">
                {t("data_sources")}: GISTDA Sphere API · THEOS-2 AI Layer · attach_all_20240805.csv
              </p>
            </div>
            <Button asChild variant="secondary">
              <Link to="/rankings">{t("nav_rank")}</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
