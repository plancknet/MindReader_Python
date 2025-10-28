import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { useCountdown } from "../../hooks/useCountdown";
import { useGazeTracking } from "../../hooks/useGazeTracking";
import type { FocusResolution } from "../../types";

interface FocusStageScreenProps {
  quadrants: string[][];
  stage: 1 | 2;
  countdownSeconds: number;
  onResolve: (resolution: FocusResolution) => void;
  onFallback: () => void;
  debugMode: boolean;
  trackingEnabled: boolean;
}

const STAGE_LABELS: Record<1 | 2, string> = {
  1: "Escolha o quadrante com sua palavra",
  2: "Fixe a palavra final",
};

const QUADRANT_BASE_STYLES = [
  "border-quadrant.a/50 bg-quadrant.a/15",
  "border-quadrant.b/50 bg-quadrant.b/15",
  "border-quadrant.c/50 bg-quadrant.c/15",
  "border-quadrant.d/50 bg-quadrant.d/15",
];

const QUADRANT_GLOW_STYLES = [
  "shadow-[0_0_35px_rgba(74,222,128,0.45)] border-quadrant.a",
  "shadow-[0_0_35px_rgba(56,189,248,0.45)] border-quadrant.b",
  "shadow-[0_0_35px_rgba(249,115,22,0.45)] border-quadrant.c",
  "shadow-[0_0_35px_rgba(244,114,182,0.45)] border-quadrant.d",
];

export function FocusStageScreen({
  quadrants,
  stage,
  countdownSeconds,
  onResolve,
  onFallback,
  debugMode,
  trackingEnabled,
}: FocusStageScreenProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const countsRef = useRef([0, 0, 0, 0]);
  const resolvedRef = useRef(false);
  const fallbackRef = useRef(false);
  const [highlight, setHighlight] = useState<number | null>(null);
  const [manualPrompt, setManualPrompt] = useState(false);

  const { point, status } = useGazeTracking({ enabled: trackingEnabled });
  const { remaining, isRunning, start, reset } = useCountdown({
    seconds: countdownSeconds,
    autoStart: true,
    onComplete: () => {
      if (resolvedRef.current) {
        return;
      }

      const counts = countsRef.current;
      const total = counts.reduce((acc, value) => acc + value, 0);
      const best = Math.max(...counts);
      const bestIndex = counts.indexOf(best);
      const confidence = total > 0 ? best / total : 0;

      const signalTooLow = status.signal < 0.2;
      const confidenceTooLow = confidence < 0.35;
      const insufficient = total === 0 || signalTooLow || confidenceTooLow;

      if (insufficient) {
        setManualPrompt(true);
        onFallback();
        return;
      }

      resolvedRef.current = true;
      onResolve({
        index: bestIndex,
        confidence,
        source: "gaze",
      });
    },
  });

  useEffect(() => {
    countsRef.current = [0, 0, 0, 0];
    resolvedRef.current = false;
    fallbackRef.current = false;
    setHighlight(null);
    setManualPrompt(false);
    reset();
    start();
  }, [quadrants, reset, start]);

  useEffect(() => {
    if (!status.supported && !fallbackRef.current) {
      fallbackRef.current = true;
      setManualPrompt(true);
      onFallback();
    }
  }, [onFallback, status.supported]);

  useEffect(() => {
    if (!trackingEnabled) {
      setManualPrompt(true);
    } else if (!fallbackRef.current) {
      setManualPrompt(false);
    }
  }, [trackingEnabled]);

  useEffect(() => {
    const updateBounds = () => {
      if (gridRef.current) {
        boundsRef.current = gridRef.current.getBoundingClientRect();
      }
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, []);

  useEffect(() => {
    if (!point || !isRunning) {
      return;
    }

    if (!boundsRef.current && gridRef.current) {
      boundsRef.current = gridRef.current.getBoundingClientRect();
    }

    const bounds = boundsRef.current;
    if (!bounds || bounds.width === 0 || bounds.height === 0) {
      return;
    }

    const relativeX = point.x - bounds.left;
    const relativeY = point.y - bounds.top;

    if (
      relativeX < 0 ||
      relativeY < 0 ||
      relativeX > bounds.width ||
      relativeY > bounds.height
    ) {
      setHighlight(null);
      return;
    }

    const col = relativeX < bounds.width / 2 ? 0 : 1;
    const row = relativeY < bounds.height / 2 ? 0 : 1;
    const quadrantIndex = row * 2 + col;

    setHighlight(quadrantIndex);
    countsRef.current[quadrantIndex] += 1;
  }, [point, isRunning]);

  const remainingSeconds = useMemo(
    () => Math.ceil(remaining),
    [remaining],
  );
  const progress = useMemo(() => {
    if (!Number.isFinite(remaining)) {
      return 0;
    }
    return Math.max(
      0,
      Math.min(1, remaining / countdownSeconds),
    );
  }, [countdownSeconds, remaining]);

  const handleManualResolve = (index: number) => {
    resolvedRef.current = true;
    onResolve({
      index,
      confidence: 1,
      source: "manual",
    });
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
          Fixe seu olhar na palavra escolhida
        </p>
        <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">
          Quadrante {stage}
        </h2>
        <p className="mt-3 text-base text-slate-300">
          {STAGE_LABELS[stage]} -{" "}
          {remainingSeconds > 0 ? `${remainingSeconds}s` : "Processando..."}
        </p>
        {status.supported ? (
          <p className="mt-2 text-xs uppercase tracking-[0.35em] text-slate-500">
            Sinal do olhar: {(status.signal * 100).toFixed(0)}%
          </p>
        ) : (
          <p className="mt-2 text-xs uppercase tracking-[0.35em] text-amber-400">
            Rastreio não suportado - ative o modo debug
          </p>
        )}

        <div className="mx-auto mt-6 h-2 w-56 overflow-hidden rounded-full bg-slate-800/70">
          <div
            className="h-full origin-left rounded-full bg-quadrant.b transition-transform duration-75 ease-out"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </div>

      <div
        ref={gridRef}
        className="grid h-[480px] w-full max-w-4xl grid-cols-2 grid-rows-2 gap-5"
      >
        {quadrants.map((words, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleManualResolve(idx)}
            disabled={!debugMode && !manualPrompt}
            className={clsx(
              "group relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border bg-slate-900/30 px-6 py-8 text-center shadow-inner transition",
              QUADRANT_BASE_STYLES[idx],
              highlight === idx &&
                "ring-2 ring-white/80 ring-offset-2 ring-offset-slate-950",
              highlight === idx && QUADRANT_GLOW_STYLES[idx],
              !debugMode &&
                !manualPrompt &&
                "cursor-default",
              (debugMode || manualPrompt) &&
                "hover:border-white/60 hover:bg-white/10 hover:text-white",
            )}
          >
            <span className="text-xs uppercase tracking-[0.4em] text-slate-400">
              Quadrante {idx + 1}
            </span>
            <ul
              className={clsx(
                "mt-4 space-y-2 text-lg font-semibold text-slate-100",
                stage === 2 && "text-2xl",
              )}
            >
              {words.map((word) => (
                <li key={word} className="transition group-hover:scale-[1.025]">
                  {word}
                </li>
              ))}
              {words.length === 0 && (
                <li className="text-sm font-normal uppercase tracking-[0.3em] text-slate-500">
                  aguardando
                </li>
              )}
            </ul>
            {(debugMode || manualPrompt) && (
              <span className="mt-6 text-[0.65rem] uppercase tracking-[0.35em] text-slate-400">
                Clique para confirmar
              </span>
            )}
          </button>
        ))}
      </div>

      {(manualPrompt || debugMode) && (
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
          Modo debug ativo - clique no quadrante observado
        </p>
      )}
    </div>
  );
}
