import type { ThemeDefinition, ThemeKey } from "../../data/themes";

interface ThemeSelectionScreenProps {
  themes: Record<ThemeKey, ThemeDefinition>;
  onSelect: (theme: ThemeKey) => void;
}

const EMOJI_BY_THEME: Record<ThemeKey, string> = {
  paises: "🌍",
  frutas: "🍓",
  animais: "🦁",
};

export function ThemeSelectionScreen({
  themes,
  onSelect,
}: ThemeSelectionScreenProps) {
  const cards = Object.entries(themes).map(([key, info], index) => ({
    key: key as ThemeKey,
    label: info.label,
    emoji: EMOJI_BY_THEME[key as ThemeKey] ?? "✨",
    index,
  }));

  return (
    <div className="relative flex h-full flex-col justify-center gap-12 text-center">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-40 w-[60%] -translate-x-1/2 rounded-full bg-gradient-to-r from-quadrant.a/15 via-quadrant.b/18 to-quadrant.d/12 blur-3xl" />
      </div>

      <div className="space-y-5">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
          O que está pensando?
        </p>
        <h2 className="text-4xl font-semibold text-white md:text-5xl">
          Escolha um tema para alinhar a leitura
        </h2>
        <p className="mx-auto max-w-2xl text-base text-slate-300 md:text-lg">
          Cada tema ativa uma matriz diferente de palavras. Fixe o olhar no
          quadrante desejado durante alguns segundos e deixe o MindReader sincronizar.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <button
            key={card.key}
            type="button"
            onClick={() => onSelect(card.key)}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-8 py-14 text-lg font-semibold text-white shadow-[0_20px_45px_rgba(15,23,42,0.35)] transition hover:-translate-y-1 hover:border-quadrant.b/70 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-quadrant.b"
          >
            <span className="absolute -top-12 right-6 text-8xl opacity-20 transition group-hover:opacity-35">
              {card.emoji}
            </span>
            <span className="text-xs uppercase tracking-[0.35em] text-slate-400">
              Quadrante {card.index + 1}
            </span>
            <span className="mt-5 block text-3xl font-bold text-white">
              {card.label}
            </span>
            <span className="mt-4 block text-xs uppercase tracking-[0.35em] text-slate-400">
              Olhe firme até o brilho intensificar
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
