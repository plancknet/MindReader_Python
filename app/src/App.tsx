import { useEffect, useMemo, useState } from "react";
import { THEMES, type ThemeKey } from "./data/themes";
import type { AppPhase, FocusResolution, TrackingSnapshot } from "./types";
import { IntroScreen } from "./components/screens/IntroScreen";
import { ThemeSelectionScreen } from "./components/screens/ThemeSelectionScreen";
import { FocusStageScreen } from "./components/screens/FocusStageScreen";
import { RevealScreen } from "./components/screens/RevealScreen";
import { buildFinalQuadrants, buildInitialQuadrants } from "./utils/game";
import { gazeTracker } from "./services/gazeTracker";

const PHASE_LABEL: Record<AppPhase, string> = {
  intro: "Calibração",
  theme: "Escolha do tema",
  "first-look": "Leitura 1/2",
  "second-look": "Leitura 2/2",
  reveal: "Resultado",
};

function App() {
  const [phase, setPhase] = useState<AppPhase>("intro");
  const [theme, setTheme] = useState<ThemeKey | null>(null);
  const [initialQuadrants, setInitialQuadrants] = useState<string[][]>([]);
  const [finalQuadrants, setFinalQuadrants] = useState<string[][]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [focusHistory, setFocusHistory] = useState<TrackingSnapshot[]>([]);

  const currentThemeLabel = useMemo(
    () => (theme ? THEMES[theme]?.label ?? "" : ""),
    [theme],
  );

  useEffect(() => {
    if (trackingEnabled) {
      gazeTracker.start().catch(() => undefined);
    } else {
      gazeTracker.stop().catch(() => undefined);
    }
  }, [trackingEnabled]);

  const handleStart = () => {
    setTrackingEnabled(true);
    setPhase("theme");
  };

  const handleThemeSelect = (key: ThemeKey) => {
    const themeDefinition = THEMES[key];
    if (!themeDefinition) {
      return;
    }

    setTheme(key);
    const quadrants = buildInitialQuadrants(themeDefinition);
    setInitialQuadrants(quadrants);
    setDebugMode(false);
    setFocusHistory([]);
    setPhase("first-look");
  };

  const appendHistory = (resolution: FocusResolution) => {
    setFocusHistory((history) => [
      ...history,
      {
        quadrantId: resolution.index,
        confidence: resolution.confidence,
        timestamp: Date.now(),
      },
    ]);
  };

  const handleFallback = () => {
    setDebugMode(true);
  };

  const handleFirstResolution = (resolution: FocusResolution) => {
    appendHistory(resolution);

    const chosenQuadrant = initialQuadrants[resolution.index] ?? [];
    const prepared = buildFinalQuadrants(chosenQuadrant);
    setFinalQuadrants(prepared);
    setPhase("second-look");
  };

  const handleSecondResolution = (resolution: FocusResolution) => {
    appendHistory(resolution);

    const word = finalQuadrants[resolution.index]?.[0] ?? null;
    setSelectedWord(word);
    setPhase("reveal");
  };

  const handleRestart = () => {
    setPhase("intro");
    setTheme(null);
    setInitialQuadrants([]);
    setFinalQuadrants([]);
    setSelectedWord(null);
    setDebugMode(false);
    setFocusHistory([]);
    setTrackingEnabled(false);
  };

  const averageConfidence =
    focusHistory.length > 0
      ? Math.round(
          (focusHistory.reduce(
            (total, item) => total + item.confidence,
            0,
          ) /
            focusHistory.length) *
            100,
        )
      : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020416] text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),transparent_60%),radial-gradient(circle_at_bottom,_rgba(244,114,182,0.16),transparent_55%)]" />
        <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-quadrant.a/25 blur-[160px]" />
        <div className="absolute -right-20 top-10 h-60 w-60 rounded-full bg-quadrant.b/30 blur-[140px]" />
      </div>

      <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-12 md:px-12">
        <header className="mb-12 flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.35em] text-slate-400">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <span>Fase</span>
            <span className="text-quadrant.b">{PHASE_LABEL[phase]}</span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <span>Tracking</span>
            <span className={trackingEnabled ? "text-quadrant.a" : "text-amber-300"}>
              {trackingEnabled ? "Ativo" : "Em espera"}
            </span>
          </span>
        </header>

        {phase === "intro" && (
          <IntroScreen onStart={handleStart} showVideo={trackingEnabled} />
        )}

        {phase === "theme" && (
          <ThemeSelectionScreen themes={THEMES} onSelect={handleThemeSelect} />
        )}

        {phase === "first-look" && (
          <FocusStageScreen
            stage={1}
            quadrants={initialQuadrants}
            countdownSeconds={5}
            onResolve={handleFirstResolution}
            onFallback={handleFallback}
            debugMode={debugMode}
            trackingEnabled={trackingEnabled}
          />
        )}

        {phase === "second-look" && (
          <FocusStageScreen
            stage={2}
            quadrants={finalQuadrants}
            countdownSeconds={5}
            onResolve={handleSecondResolution}
            onFallback={handleFallback}
            debugMode={debugMode}
            trackingEnabled={trackingEnabled}
          />
        )}

        {phase === "reveal" && selectedWord && (
          <RevealScreen word={selectedWord} onRestart={handleRestart} />
        )}

        {phase === "reveal" && !selectedWord && (
          <div className="flex flex-1 items-center justify-center">
            <button
              type="button"
              onClick={handleRestart}
              className="rounded-full border border-slate-800 px-6 py-3 text-sm uppercase tracking-[0.3em]"
            >
              Reiniciar MindReader
            </button>
          </div>
        )}

        <footer className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-6 text-xs uppercase tracking-[0.3em] text-slate-500">
          <span>MindReader · experimento interativo</span>
          {currentThemeLabel && <span>Tema: {currentThemeLabel}</span>}
          {averageConfidence !== null && (
            <span>Precisão média: {averageConfidence}%</span>
          )}
        </footer>
      </main>
    </div>
  );
}

export default App;
