export type PaletteKey = "night" | "day";

export interface PaletteDefinition {
  label: string;
  description: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    accent: string;
    card: string;
    quadrants: [string, string, string, string];
  };
}

export const PALETTES: Record<PaletteKey, PaletteDefinition> = {
  night: {
    label: "Modo Noturno",
    description: "Contraste alto com brilhos frios.",
    colors: {
      background: "230 35% 6%",
      foreground: "210 25% 96%",
      primary: "200 90% 55%",
      accent: "280 85% 65%",
      card: "235 30% 12%",
      quadrants: [
        "280 100% 70%",
        "195 100% 50%",
        "142 76% 36%",
        "14 100% 57%",
      ],
    },
  },
  day: {
    label: "Modo Diurno",
    description: "Fundo claro com tons solares.",
    colors: {
      background: "48 100% 97%",
      foreground: "26 30% 18%",
      primary: "32 95% 55%",
      accent: "12 85% 58%",
      card: "0 0% 100%",
      quadrants: [
        "32 95% 60%",
        "12 85% 60%",
        "147 70% 45%",
        "212 80% 55%",
      ],
    },
  },
};

export const DEFAULT_PALETTE: PaletteKey = "night";

export const applyPalette = (palette: PaletteDefinition) => {
  const root = document.documentElement;
  root.style.setProperty("--background", palette.colors.background);
  root.style.setProperty("--foreground", palette.colors.foreground);
  root.style.setProperty("--primary", palette.colors.primary);
  root.style.setProperty("--accent", palette.colors.accent);
  root.style.setProperty("--card", palette.colors.card);

  root.style.setProperty("--quadrant-1", palette.colors.quadrants[0]);
  root.style.setProperty("--quadrant-2", palette.colors.quadrants[1]);
  root.style.setProperty("--quadrant-3", palette.colors.quadrants[2]);
  root.style.setProperty("--quadrant-4", palette.colors.quadrants[3]);
};
