import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Building, Satellite } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About & Contact — Geo-Smart Location Analysis" },
      {
        name: "description",
        content:
          "Project goals of Geo-Smart Location Analysis and a contact form for developers and urban planning agencies.",
      },
      { property: "og:title", content: "About Geo-Smart Location Analysis" },
      {
        property: "og:description",
        content: "Open geospatial intelligence for Thai urban planning and investment.",
      },
    ],
  }),
  component: About,
});

function About() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-4 py-12">
      <header>
        <h1 className="text-3xl font-semibold">{t("about_title")}</h1>
        <p className="mt-3 text-muted-foreground">{t("about_body")}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Satellite, label: "THEOS-2 AI Layer" },
          { icon: Building, label: "GISTDA Sphere API" },
          { icon: Mail, label: "Treasury Land Appraisal CSV" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-3 p-5">
              <s.icon className="size-5 text-primary" />
              <span className="text-sm">{s.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold">{t("contact")}</h2>
          <form
            className="mt-5 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              toast.success(t("sent"));
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t("name")}</Label>
                <Input id="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input id="email" type="email" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="msg">{t("message")}</Label>
              <Textarea id="msg" rows={5} required />
            </div>
            <Button type="submit">{sent ? t("sent") : t("send")}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}