import { useEffect, useMemo, useState } from "react";
import { SetupScreen } from "../components/SetupScreen";
import { CalibrationScreen } from "../components/CalibrationScreen";
import { Countdown } from "../components/Countdown";
import { MindReveal } from "../components/MindReveal";
import {
  applyPalette,
  DEFAULT_PALETTE,
  PALETTES,
  type PaletteKey,
} from "../data/palettes";
import { getRandomWords } from "../data/words";
import { WORDS_PER_QUADRANT } from "../utils/constants";
import type { GameStage, Mode } from "../types";
import { gazeTracker } from "../services/gazeTracker";

const WORDS_PER_SESSION = WORDS_PER_QUADRANT;

const STAGE_LABELS: Record<GameStage, string> = {
  setup: "Configuracao",
  calibration: "Calibracao",
  countdown: "Leitura",
  reveal: "Resultado",
};

export default function Index() {
  const [stage, setStage] = useState<GameStage>("setup");
  const [mode, setMode] = useState<Mode>("debug");
  const [palette, setPalette] = useState<PaletteKey>(DEFAULT_PALETTE);
  const [words, setWords] = useState<string[]>([]);
  const [finalWord, setFinalWord] = useState<string | null>(null);
  const [lastConfidence, setLastConfidence] = useState<number | null>(null);
  const [lastSignal, setLastSignal] = useState<number | null>(null);

  useEffect(() => {
    applyPalette(PALETTES[palette]);
  }, [palette]);

  useEffect(() => {
    if (stage === "calibration" || stage === "countdown") {
      gazeTracker.start().catch(() => undefined);
      return () => {
        gazeTracker.stop().catch(() => undefined);
      };
    }
    return () => undefined;
  }, [stage]);

  useEffect(() => {
    gazeTracker.setPreviewVisible(stage === "calibration");
  }, [stage]);

  const stageLabel = useMemo(() => STAGE_LABELS[stage], [stage]);

  const handleSetupContinue = () => {
    setWords(getRandomWords(WORDS_PER_SESSION));
    setFinalWord(null);
    setLastConfidence(null);
    setLastSignal(null);
    setStage("calibration");
  };

  const handleCalibrationContinue = () => {
    setStage("countdown");
  };

  const handleCountdownComplete = (
    quadrant: number,
    info: { confidence: number; signal: number },
  ) => {
    setLastConfidence(info.confidence);
    setLastSignal(info.signal);
    setFinalWord(words[quadrant] ?? null);
    setStage("reveal");
  };

  const handleRestart = () => {
    setStage("setup");
    setFinalWord(null);
    setWords([]);
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
          <span className="text-white">
            {mode === "debug" ? "Debug" : "Produção"}
          </span>
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
          <span>Paleta</span>
          <span className="text-white">{PALETTES[palette].label}</span>
        </span>
        {lastConfidence !== null && (
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <span>Confiança</span>
            <span className="text-white">
              {(lastConfidence * 100).toFixed(0)}%
            </span>
            <span className="hidden text-slate-500 sm:inline">
              · Sinal {((lastSignal ?? 0) * 100).toFixed(0)}%
            </span>
          </span>
        )}
      </header>

      <main className="flex flex-1 flex-col overflow-hidden">
        {stage === "setup" && (
          <SetupScreen
            selectedPalette={palette}
            onPaletteChange={setPalette}
            mode={mode}
            onModeChange={setMode}
            onContinue={handleSetupContinue}
          />
        )}

        {stage === "calibration" && (
          <CalibrationScreen onContinue={handleCalibrationContinue} />
        )}

        {stage === "countdown" && (
          <Countdown
            words={words}
            duration={5}
            onComplete={handleCountdownComplete}
            title="Fixe seu olhar na palavra escolhida"
            showHighlight={mode === "debug"}
          />
        )}

        {stage === "reveal" && finalWord && (
          <MindReveal word={finalWord} onRestart={handleRestart} />
        )}
      </main>
    </div>
  );
}
