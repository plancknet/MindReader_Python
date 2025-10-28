import { GazeVideoFeed } from "./GazeVideoFeed";

interface WebcamSetupProps {
  onContinue: () => void;
  ready?: boolean;
}

export function WebcamSetup({ onContinue, ready = true }: WebcamSetupProps) {
  return (
    <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:items-center">
      <div className="space-y-6 animate-fade-in">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-300">
          <span>Etapa 1</span>
          <span className="text-quadrant.b">Calibrar olhar</span>
        </div>
        <h2 className="text-4xl font-semibold text-white md:text-5xl">
          Enquadre o rosto e mova os olhos pelos cantos da tela.
        </h2>
        <p className="max-w-xl text-base text-slate-300 md:text-lg">
          O MindReader usa estes movimentos para calibrar o rastreio ocular. Se
          possível, mantenha boa iluminação frontal e evite reflexos nos óculos.
        </p>

        <ul className="space-y-3 text-left text-sm text-slate-400">
          <li className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-quadrant.b" />
            <span>Olhe para todos os cantos da tela por alguns segundos.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-quadrant.c" />
            <span>Mantenha o rosto centralizado no quadro da câmera.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-quadrant.d" />
            <span>Evite movimentar a cabeça durante a contagem final.</span>
          </li>
        </ul>

        <button
          type="button"
          onClick={onContinue}
          className="rounded-full bg-gradient-to-r from-quadrant.b to-quadrant.d px-10 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-950 shadow-[0_0_45px_rgba(56,189,248,0.35)] transition hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-quadrant.b"
        >
          Começar leitura
        </button>
      </div>

      <div className="flex items-center justify-center">
        <GazeVideoFeed
          active={ready}
          className="relative flex h-[420px] w-full max-w-sm items-center justify-center overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/5 p-3 shadow-[0_0_55px_rgba(56,189,248,0.25)]"
        />
      </div>
    </div>
  );
}
