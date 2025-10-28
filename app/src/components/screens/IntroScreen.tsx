import { GazeVideoFeed } from "../ui/GazeVideoFeed";

interface IntroScreenProps {
  onStart: () => void;
  showVideo: boolean;
}

export function IntroScreen({ onStart, showVideo }: IntroScreenProps) {
  return (
    <div className="relative grid h-full w-full gap-12 overflow-hidden md:grid-cols-[1.15fr_1fr]">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-quadrant.b/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-quadrant.d/25 blur-[140px]" />
      </div>

      <div className="flex flex-col justify-center gap-8">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-200">
          <span>MindReader</span>
          <span className="text-quadrant.b">v1.0</span>
        </div>

        <div className="space-y-5">
          <h1 className="text-4xl font-semibold text-white md:text-5xl">
            Conecte sua mente e deixe o olhar contar segredos.
          </h1>
          <p className="max-w-xl text-base text-slate-300 md:text-lg">
            Posicione-se na frente da câmera, ajuste o rosto até ficar centralizado
            e respire fundo. É hora de calibrar o MindReader para sincronizar com
            seus pensamentos mais brilhantes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onStart}
            className="rounded-full bg-gradient-to-r from-quadrant.b to-quadrant.d px-10 py-4 text-lg font-semibold text-slate-950 shadow-[0_12px_40px_rgba(56,189,248,0.25)] transition hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-quadrant.b"
          >
            Conectar a mente
          </button>
          <span className="text-sm uppercase tracking-[0.35em] text-slate-500">
            {showVideo ? "Calibrando foco ocular..." : "Preparando acesso à câmera"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center text-xs uppercase tracking-[0.3em] text-slate-400">
          <div className="rounded-2xl border border-white/5 bg-white/5 py-3">
            <span className="block text-lg font-semibold text-white">60 fps</span>
            <span>Sinal</span>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 py-3">
            <span className="block text-lg font-semibold text-white">Calibração</span>
            <span>Automática</span>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 py-3">
            <span className="block text-lg font-semibold text-white">Modo</span>
            <span>Debug seguro</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <GazeVideoFeed
          active={showVideo}
          className="relative flex h-[440px] w-full max-w-sm items-center justify-center overflow-hidden rounded-[2.2rem] border border-white/10 bg-slate-900/40 p-3 shadow-[0_0_55px_rgba(56,189,248,0.25)]"
        />
      </div>
    </div>
  );
}
