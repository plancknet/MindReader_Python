import { THEMES } from "../data/themes";
import type { ThemeKey } from "../types";

interface ThemeSelectionProps {
  onSelect: (theme: ThemeKey) => void;
}

const THEME_EMOJIS: Record<ThemeKey, string> = {
  countries: "🌍",
  fruits: "🍓",
  animals: "🦁",
};

export function ThemeSelection({ onSelect }: ThemeSelectionProps) {
  return (
    <div className="space-y-10 text-center animate-fade-in">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-300">
          <span>Etapa 2</span>
          <span className="text-quadrant.b">Escolher tema</span>
        </div>
        <h2 className="text-4xl font-semibold text-white md:text-5xl">
          Qual universo combina com o seu pensamento?
        </h2>
        <p className="mx-auto max-w-2xl text-base text-slate-300 md:text-lg">
          Fixe seu olhar no quadrante que representa o tema desejado. Após
          selecionar, pense em uma palavra e mantenha o olhar nela durante a
          contagem regressiva.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {(Object.keys(THEMES) as ThemeKey[]).map((key, index) => {
          const theme = THEMES[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-10 py-14 text-left shadow-[0_20px_45px_rgba(15,23,42,0.45)] transition hover:-translate-y-1 hover:border-quadrant.b/70 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-quadrant.b"
            >
              <span className="absolute -top-14 right-6 text-8xl opacity-20 transition group-hover:opacity-35">
                {THEME_EMOJIS[key]}
              </span>
              <span className="text-xs uppercase tracking-[0.35em] text-slate-400">
                Quadrante {index + 1}
              </span>
              <span className="mt-5 block text-3xl font-bold text-white">
                {theme.label}
              </span>
              <span className="mt-4 block text-xs uppercase tracking-[0.4em] text-slate-400">
                Olhe fixamente por alguns segundos
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
