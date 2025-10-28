import type { ThemeDefinition, ThemeKey } from "../../data/themes";

interface ThemeSelectionScreenProps {
  themes: Record<ThemeKey, ThemeDefinition>;
  onSelect: (theme: ThemeKey) => void;
}

export function ThemeSelectionScreen({
  themes,
  onSelect,
}: ThemeSelectionScreenProps) {
  const cards: Array<{ key: ThemeKey; label: string; emoji: string }> =
    Object.entries(themes).map(([key, info]) => ({
      key: key as ThemeKey,
      label: info.label,
      emoji:
        key === "paises"
          ? "🌍"
          : key === "frutas"
          ? "🍓"
          : key === "animais"
          ? "🦁"
          : "✨",
    }));

  return (
    <div className="flex h-full flex-col justify-center gap-10 text-center">
      <div>
        <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
          O que está pensando?
        </p>
        <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">
          Escolha um tema
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 md:text-lg">
          Fixe o olhar no quadrante com o tema que combina com seu pensamento.
          Essa etapa calibra o MindReader para encontrar a palavra exata.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card, index) => (
          <button
            key={card.key}
            type="button"
            onClick={() => onSelect(card.key)}
            className="group relative overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-900/60 px-8 py-12 text-lg font-semibold text-slate-100 transition hover:border-quadrant.b/70 hover:bg-slate-900/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-quadrant.b"
          >
            <span className="absolute -top-10 right-6 text-7xl opacity-20 transition group-hover:opacity-35">
              {card.emoji}
            </span>
            <span className="text-sm uppercase tracking-[0.35em] text-slate-500">
              Quadrante {index + 1}
            </span>
            <span className="mt-4 block text-2xl font-bold text-white">
              {card.label}
            </span>
            <span className="mt-3 block text-xs uppercase tracking-[0.35em] text-slate-500">
              Olhe por 3 segundos para confirmar
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
