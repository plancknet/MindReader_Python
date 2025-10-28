import { GazeVideoFeed } from "../ui/GazeVideoFeed";

interface IntroScreenProps {
  onStart: () => void;
  showVideo: boolean;
}

export function IntroScreen({ onStart, showVideo }: IntroScreenProps) {
  return (
    <div className="grid h-full w-full gap-12 md:grid-cols-[1.2fr_1fr]">
      <div className="flex flex-col items-start justify-center gap-8">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
            MindReader
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-white md:text-5xl">
            Conecte a sua mente
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-300 md:text-lg">
            Ative a câmera, fixe o olhar e prepare-se para a leitura mental mais
            estilosa do multiverso. Assim que estiver pronto, clique no botão e
            deixe o MindReader assumir o controle.
          </p>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="rounded-full bg-quadrant.b px-10 py-4 text-lg font-semibold text-slate-950 transition hover:bg-sky-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-quadrant.b"
        >
          Conectar a mente
        </button>

        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
          {showVideo
            ? "Ajuste o rosto até ficar centralizado."
            : "Preparando vídeo..."}
        </p>
      </div>

      <div className="flex items-center justify-center">
        <GazeVideoFeed
          active={showVideo}
          className="relative flex h-[420px] w-full max-w-sm items-center justify-center overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-900/40 p-2 shadow-[0_0_40px_rgba(56,189,248,0.18)]"
        />
      </div>
    </div>
  );
}
