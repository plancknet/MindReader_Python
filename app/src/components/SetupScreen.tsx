import type { Mode } from "../types";
import { PALETTES, type PaletteKey } from "../data/palettes";

interface SetupScreenProps {
  selectedPalette: PaletteKey;
  onPaletteChange: (key: PaletteKey) => void;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  onContinue: () => void;
}

const paletteEntries = Object.entries(PALETTES) as Array<
  [PaletteKey, (typeof PALETTES)[PaletteKey]]
>;

export function SetupScreen({
  selectedPalette,
  onPaletteChange,
  mode,
  onModeChange,
  onContinue,
}: SetupScreenProps) {
  return (
    <div className="space-y-10">
      <div className="space-y-4 text-center animate-fade-in">
        <h1 className="text-4xl font-semibold text-white md:text-5xl">
          Personalize sua leitura mental
        </h1>
        <p className="mx-auto max-w-2xl text-base text-slate-300 md:text-lg">
          Escolha a paleta que combina com o momento e defina se deseja ver os
          destaques de debug durante a leitura.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-left text-sm uppercase tracking-[0.35em] text-slate-400">
          Paleta visual
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {paletteEntries.map(([key, palette]) => {
            const isActive = key === selectedPalette;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onPaletteChange(key)}
                className={`group relative overflow-hidden rounded-3xl border px-6 py-6 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isActive
                    ? "border-quadrant.b/80 bg-white/10 shadow-[0_20px_45px_rgba(56,189,248,0.35)]"
                    : "border-white/10 bg-white/5 hover:border-quadrant.b/40 hover:bg-white/10"
                }`}
              >
                <span className="text-xs uppercase tracking-[0.35em] text-slate-400">
                  {palette.label}
                </span>
                <span className="mt-3 block text-sm text-slate-300">
                  {palette.description}
                </span>
                <div className="mt-4 flex gap-2">
                  {palette.colors.quadrants.map((hsl, idx) => (
                    <span
                      key={idx} // deliberate: visual swatches
                      className="h-10 flex-1 rounded-full"
                      style={{ background: `hsl(${hsl})` }}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-left text-sm uppercase tracking-[0.35em] text-slate-400">
          Modo de operacao
        </h2>
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => onModeChange("debug")}
            className={`rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-quadrant.b ${
              mode === "debug"
                ? "bg-quadrant.b text-slate-900"
                : "border border-white/15 bg-white/5 text-slate-200 hover:border-quadrant.b/60"
            }`}
          >
            Debug
          </button>
          <button
            type="button"
            onClick={() => onModeChange("production")}
            className={`rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-quadrant.b ${
              mode === "production"
                ? "bg-quadrant.d text-slate-900"
                : "border border-white/15 bg-white/5 text-slate-200 hover:border-quadrant.d/60"
            }`}
          >
            Producao
          </button>
        </div>
        <p className="text-sm text-slate-400">
          No modo debug os quadrantes brilham quando recebem foco do olhar. No
          modo producao eles permanecem discretos.
        </p>
      </section>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={onContinue}
          className="rounded-full bg-gradient-to-r from-quadrant.b to-quadrant.d px-12 py-4 text-lg font-semibold text-slate-900 shadow-[0_20px_45px_rgba(56,189,248,0.35)] transition hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-quadrant.b"
        >
          Comecar calibracao
        </button>
      </div>
    </div>
  );
}
