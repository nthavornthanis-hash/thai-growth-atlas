import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Mode = "dark" | "light";
const Ctx = createContext<{ mode: Mode; toggle: () => void }>({ mode: "dark", toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("dark");
  useEffect(() => {
    const saved = localStorage.getItem("gsla-theme") as Mode | null;
    if (saved) setMode(saved);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    localStorage.setItem("gsla-theme", mode);
  }, [mode]);
  return (
    <Ctx.Provider value={{ mode, toggle: () => setMode((m) => (m === "dark" ? "light" : "dark")) }}>
      {children}
    </Ctx.Provider>
  );
}

export const useTheme = () => useContext(Ctx);