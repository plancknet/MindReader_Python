import { useEffect, useMemo, useState } from "react";
import { WelcomeScreen } from "../components/WelcomeScreen";
import { WebcamSetup } from "../components/WebcamSetup";
import { ThemeSelection } from "../components/ThemeSelection";
import { Countdown } from "../components/Countdown";
import { MindReveal } from "../components/MindReveal";
import { WORDS_PER_QUADRANT } from "../utils/constants";
import { THEMES, getRandomWords } from "../data/themes";
import type { GameStage, ThemeKey } from "../types";
import { gazeTracker } from "../services/gazeTracker";

const FIRST_STAGE_WORDS = 16;

export default function Index() {
  const [stage, setStage] = useState<GameStage>("welcome");
  const [theme, setTheme] = useState<ThemeKey | null>(null);
  const [words, setWords] = useState<string[]>([]);
  const [finalWords, setFinalWords] = useState<string[]>([]);
  const [finalWord, setFinalWord] = useState<string | null>(null);
  const [lastConfidence, setLastConfidence] = useState<number | null>(null);
  const [lastSignal, setLastSignal] = useState<number | null>(null);

  useEffect(() => {
    if (stage === "webcam" || stage === "first-countdown" || stage === "second-countdown") {
      gazeTracker.start().catch(() => undefined);
      return () => {
        gazeTracker.stop().catch(() => undefined);
      };
    }
    return () => undefined;
  }, [stage]);

  const currentThemeLabel = useMemo(
    () => (theme ? THEMES[theme]?.label ?? "" : ""),
    [theme],
  );

  const handleStart = () => {
    setStage("webcam");
  };

  const handleCalibrationComplete = () => {
    setStage("theme");
  };

  const handleThemeSelect = (selectedTheme: ThemeKey) => {
    setTheme(selectedTheme);
    const selectedWords = getRandomWords(selectedTheme, FIRST_STAGE_WORDS);
    setWords(selectedWords);
    setFinalWords([]);
    setFinalWord(null);
    setStage("first-countdown");
  };

  const handleFirstCountdownComplete = (
    quadrant: number,
    info: { confidence: number; signal: number },
  ) => {
    setLastConfidence(info.confidence);
    setLastSignal(info.signal);

    const startIndex = quadrant * WORDS_PER_QUADRANT;
    const slice = words.slice(startIndex, startIndex + WORDS_PER_QUADRANT);
    setFinalWords(slice);
    setStage("second-countdown");
  };

  const handleSecondCountdownComplete = (
    quadrant: number,
    info: { confidence: number; signal: number },
  ) => {
    setLastConfidence(info.confidence);
    setLastSignal(info.signal);

    const word = finalWords[quadrant] ?? null;
    setFinalWord(word);
    setStage("reveal");
  };

  const handleRestart = () => {
    setStage("welcome");
    setTheme(null);
    setWords([]);
    setFinalWords([]);
    setFinalWord(null);
    setLastConfidence(null);
    setLastSignal(null);
  };

  return (
    <div className="flex min-h-screen flex-col gap-8 px-4 pb-10 pt-12 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.35em] text-slate-400">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
          <span>Fase atual</span>
          <span className="text-quadrant.b">{stage}</span>
        </span>
        {currentThemeLabel && (
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <span>Tema</span>
            <span className="text-white">{currentThemeLabel}</span>
          </span>
        )}
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

      <main className="flex flex-1 flex-col">
        {stage === "welcome" && <WelcomeScreen onStart={handleStart} />}

        {stage === "webcam" && <WebcamSetup onContinue={handleCalibrationComplete} />}

        {stage === "theme" && <ThemeSelection onSelect={handleThemeSelect} />}

        {stage === "first-countdown" && (
          <Countdown
            words={words}
            duration={5}
            onComplete={handleFirstCountdownComplete}
            title="Fixe seu olhar na palavra escolhida"
          />
        )}

        {stage === "second-countdown" && (
          <Countdown
            words={finalWords}
            duration={5}
            onComplete={handleSecondCountdownComplete}
            title="Agora escolha a palavra final"
          />
        )}

        {stage === "reveal" && finalWord && (
          <MindReveal word={finalWord} onRestart={handleRestart} />
        )}
      </main>
    </div>
  );
}
