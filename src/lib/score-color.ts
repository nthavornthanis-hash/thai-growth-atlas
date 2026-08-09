export const scoreColor = (s: number) =>
  s >= 75
    ? "#0D9488"
    : s >= 60
      ? "#14B8A6"
      : s >= 45
        ? "#F59E0B"
        : s >= 30
          ? "#F97316"
          : "#64748B";