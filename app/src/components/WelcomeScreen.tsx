interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-12 text-center">
      <div className="space-y-6 animate-fade-in">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs uppercase tracking-[0.35em] text-slate-300">
          <span>MindReader</span>
          <span className="text-quadrant.b">Eye Thinker</span>
        </div>
        <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
          Leia pensamentos com o poder do seu olhar.
        </h1>
        <p className="mx-auto max-w-2xl text-base text-slate-300 md:text-lg">
          Escolha um tema, foque na palavra e deixe o MindReader adivinhar o que
          você pensou. Aproveite o rastreio ocular em tempo real para uma
          experiência mágica e divertida.
        </p>
        <div className="grid gap-4 text-left text-sm text-slate-400 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-white">1 · Calibre</h3>
            <p className="mt-2">
              Posicione-se, ajuste a iluminação e permita o acesso à câmera.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-white">2 · Concentre</h3>
            <p className="mt-2">
              Escolha um tema e foque os olhos na palavra que deseja.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-white">3 · Surpreenda</h3>
            <p className="mt-2">
              Observe o MindReader revelar exatamente a palavra em que pensou.
            </p>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onStart}
        className="rounded-full bg-gradient-to-r from-quadrant.b to-quadrant.d px-12 py-4 text-lg font-semibold text-slate-950 shadow-[0_20px_45px_rgba(56,189,248,0.35)] transition hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-quadrant.b"
      >
        Conectar minha mente
      </button>
    </div>
  );
}
