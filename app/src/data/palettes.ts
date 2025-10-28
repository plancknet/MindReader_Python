export type PaletteKey = "aurora" | "sunset" | "nebula";

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
  aurora: {
    label: "Aurora Boreal",
    description: "Gradientes frios com brilhos azulados.",
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
  sunset: {
    label: "Pôr do Sol",
    description: "Céu quente com tons alaranjados e rosados.",
    colors: {
      background: "18 45% 8%",
      foreground: "28 35% 96%",
      primary: "25 90% 58%",
      accent: "340 80% 65%",
      card: "22 40% 15%",
      quadrants: [
        "25 95% 62%",
        "340 82% 64%",
        "12 86% 55%",
        "40 95% 60%",
      ],
    },
  },
  nebula: {
    label: "Nebulosa",
    description: "Mistura cósmica de roxos e verdes vibrantes.",
    colors: {
      background: "258 50% 7%",
      foreground: "260 50% 96%",
      primary: "275 80% 65%",
      accent: "160 70% 55%",
      card: "255 40% 15%",
      quadrants: [
        "278 90% 70%",
        "160 75% 55%",
        "200 85% 60%",
        "320 90% 66%",
      ],
    },
  },
};

export const DEFAULT_PALETTE: PaletteKey = "aurora";

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
