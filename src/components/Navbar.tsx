import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Globe, Moon, Satellite, Sun, Menu } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { probeSphere, type ApiStatus } from "@/lib/sphere";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", key: "nav_home" },
  { to: "/map", key: "nav_map" },
  { to: "/rankings", key: "nav_rank" },
  { to: "/methodology", key: "nav_method" },
  { to: "/about", key: "nav_about" },
] as const;

export function Navbar() {
  const { t, lang, setLang } = useI18n();
  const { mode, toggle } = useTheme();
  const [status, setStatus] = useState<ApiStatus>("checking");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    probeSphere().then(setStatus);
  }, []);

  return (
    <header className="sticky top-0 z-[1000] border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Satellite className="size-5" />
          </span>
          <span className="text-sm font-semibold leading-tight tracking-tight">
            Geo-Smart
            <span className="block text-[11px] font-normal text-muted-foreground">
              Location Analysis
            </span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground data-[status=active]:bg-accent data-[status=active]:font-medium data-[status=active]:text-accent-foreground"
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <span
            title={t(status === "online" ? "api_online" : status === "checking" ? "api_checking" : "api_fallback")}
            className="hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 text-[11px] text-muted-foreground md:inline-flex"
          >
            <span
              className={cn(
                "size-2 rounded-full",
                status === "online" && "bg-success animate-pulse",
                status === "checking" && "bg-warning animate-pulse",
                status === "fallback" && "bg-destructive",
              )}
            />
            {t(status === "online" ? "api_online" : status === "checking" ? "api_checking" : "api_fallback")}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setLang(lang === "th" ? "en" : "th")}
            className="gap-1.5"
          >
            <Globe className="size-4" />
            {lang === "th" ? "TH" : "EN"}
          </Button>
          <Button variant="ghost" size="icon" aria-label="theme" onClick={toggle}>
            {mode === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="menu"
            onClick={() => setOpen((o) => !o)}
          >
            <Menu className="size-4" />
          </Button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-4 py-3 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}