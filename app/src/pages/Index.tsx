import { useEffect, useMemo, useState } from "react";
import { SetupScreen } from "../components/SetupScreen";
import { WordSelectionScreen } from "../components/WordSelectionScreen";
import { Countdown } from "../components/Countdown";
import { MindReveal } from "../components/MindReveal";
import {
  applyPalette,
  DEFAULT_PALETTE,
  PALETTES,
  type PaletteKey,
} from "../data/palettes";
import { TOPIC_LABELS, getTopicWords } from "../data/words";
import { WORDS_PER_QUADRANT } from "../utils/constants";
import type { GameStage, Mode, TopicKey } from "../types";
import { gazeTracker } from "../services/gazeTracker";

const WORDS_PER_SCREEN = 16;

const STAGE_LABELS: Record<GameStage, string> = {
  setup: "Configuracao",
  grid: "Selecao",
  countdown: "Leitura",
  reveal: "Resultado",
};

export default function Index() {
  const [stage, setStage] = useState<GameStage>("setup");
  const [mode, setMode] = useState<Mode>("debug");
  const [palette, setPalette] = useState<PaletteKey>(DEFAULT_PALETTE);
  const [topic, setTopic] = useState<TopicKey>("fruta");
  const [words, setWords] = useState<string[]>([]);
  const [finalWord, setFinalWord] = useState<string | null>(null);
  const [lastConfidence, setLastConfidence] = useState<number | null>(null);
  const [lastSignal, setLastSignal] = useState<number | null>(null);

  useEffect(() => {
    applyPalette(PALETTES[palette]);
  }, [palette]);

  useEffect(() => {
    if (stage === "countdown") {
      gazeTracker.start().catch(() => undefined);
      return () => {
        gazeTracker.stop().catch(() => undefined);
      };
    }
    return () => undefined;
  }, [stage]);

  const stageLabel = useMemo(() => STAGE_LABELS[stage], [stage]);

  const handleSetupContinue = () => {
    setWords(getTopicWords(topic, WORDS_PER_SCREEN));
    setFinalWord(null);
    setLastConfidence(null);
    setLastSignal(null);
    setStage("grid");
  };

  const handleCountdownComplete = (
    quadrant: number,
    info: { confidence: number; signal: number },
  ) => {
    setLastConfidence(info.confidence);
    setLastSignal(info.signal);
    const start = quadrant * WORDS_PER_QUADRANT;
    const subset = words.slice(start, start + WORDS_PER_QUADRANT);
    setFinalWord(subset[Math.floor(Math.random() * subset.length)] ?? null);
    setStage("reveal");
  };

  const handleRestart = () => {
    setStage("setup");
    setWords([]);
    setFinalWord(null);
    setLastConfidence(null);
    setLastSignal(null);
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 px-4 pb-6 pt-8 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.35em] text-slate-400">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
          <span>Fase</span>
          <span className="text-quadrant.b">{stageLabel}</span>
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
          <span>Modo</span>
          <span className="text-white">{mode === "debug" ? "Debug" : "Producao"}</span>
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
          <span>Paleta</span>
          <span className="text-white">{PALETTES[palette].label}</span>
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
          <span>Tema</span>
          <span className="text-white">{TOPIC_LABELS[topic]}</span>
        </span>
        {lastConfidence !== null && (
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <span>Confianca</span>
            <span className="text-white">
              {(lastConfidence * 100).toFixed(0)}%
            </span>
            <span className="hidden text-slate-500 sm:inline">
              Sinal {((lastSignal ?? 0) * 100).toFixed(0)}%
            </span>
          </span>
        )}
      </header>

      <main className="flex flex-1 flex-col overflow-hidden">
        {stage === "setup" && (
          <SetupScreen
            selectedTopic={topic}
            onTopicChange={setTopic}
            selectedPalette={palette}
            onPaletteChange={setPalette}
            mode={mode}
            onModeChange={setMode}
            onContinue={handleSetupContinue}
          />
        )}

        {stage === "grid" && (
          <WordSelectionScreen topic={topic} words={words} onContinue={() => setStage("countdown")} />
        )}

        {stage === "countdown" && (
          <Countdown
            words={words}
            duration={5}
            onComplete={handleCountdownComplete}
            title="Fixe seu olhar na palavra escolhida"
            showHighlight={mode === "debug"}
            layout="spread"
          />
        )}

        {stage === "reveal" && finalWord && (
          <MindReveal word={finalWord} onRestart={handleRestart} />
        )}
      </main>
    </div>
  );
}
