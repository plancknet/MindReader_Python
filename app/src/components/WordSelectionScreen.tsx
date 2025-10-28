import { TOPIC_LABELS } from "../data/words";
import type { TopicKey } from "../types";
import { WordGrid } from "./WordGrid";

interface WordSelectionScreenProps {
  topic: TopicKey;
  words: string[];
  onContinue: () => void;
}

export function WordSelectionScreen({ topic, words, onContinue }: WordSelectionScreenProps) {
  const topicLabel = TOPIC_LABELS[topic];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-300">
          <span>Tema</span>
          <span className="text-quadrant.b">{topicLabel}</span>
        </div>
        <h2 className="text-4xl font-semibold text-white md:text-5xl">
          Escolha uma palavra e memorize.
        </h2>
        <p className="mx-auto max-w-2xl text-base text-slate-300 md:text-lg">
          Olhe atentamente para a palavra que deseja. Na proxima etapa vamos detectar qual quadrante voce observou por mais tempo.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <WordGrid
          words={words}
          highlightQuadrant={null}
          interactive={false}
          layout="grid"
          showHighlight={false}
          className="gap-6 sm:gap-8"
        />
      </div>

      <div className="flex justify-center pt-4">
        <button
          type="button"
          onClick={onContinue}
          className="rounded-full bg-gradient-to-r from-quadrant.b to-quadrant.d px-12 py-4 text-lg font-semibold text-slate-900 shadow-[0_20px_45px_rgba(56,189,248,0.35)] transition hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-quadrant.b"
        >
          Iniciar contagem
        </button>
      </div>
    </div>
  );
}
