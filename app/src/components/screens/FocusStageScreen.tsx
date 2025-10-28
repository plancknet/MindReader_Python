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
  1: "Encontre o quadrante com a sua palavra",
  2: "Fixe a palavra final",
};

const QUADRANT_BASE_STYLES = [
  "border-quadrant.a/45 bg-gradient-to-br from-quadrant.a/15 via-slate-900/40 to-transparent",
  "border-quadrant.b/45 bg-gradient-to-br from-quadrant.b/15 via-slate-900/40 to-transparent",
  "border-quadrant.c/45 bg-gradient-to-br from-quadrant.c/15 via-slate-900/40 to-transparent",
  "border-quadrant.d/45 bg-gradient-to-br from-quadrant.d/15 via-slate-900/40 to-transparent",
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
  const [lowSignal, setLowSignal] = useState(false);

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
      const bestIndex = Math.max(0, counts.indexOf(best));
      const confidence = total > 0 ? best / total : 0;

      const signalTooLow = status.signal < 0.2;
      const confidenceTooLow = confidence < 0.35;
      const insufficient = total === 0 || signalTooLow || confidenceTooLow;

      resolvedRef.current = true;

      if (insufficient) {
        fallbackRef.current = true;
        setLowSignal(true);
        onFallback();
        onResolve({
          index: bestIndex,
          confidence,
          source: "low-signal",
        });
        return;
      }

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
    setLowSignal(false);
    reset();
    start();
  }, [quadrants, reset, start]);

  useEffect(() => {
    if (!status.supported && !fallbackRef.current) {
      fallbackRef.current = true;
      setLowSignal(true);
      onFallback();
    }
  }, [onFallback, status.supported]);

  useEffect(() => {
    if (!trackingEnabled) {
      setLowSignal(true);
    } else if (!fallbackRef.current) {
      setLowSignal(false);
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
    if (!point || !isRunning || resolvedRef.current) {
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
  }, [isRunning, point]);

  const remainingSeconds = useMemo(
    () => Math.ceil(remaining),
    [remaining],
  );

  const progress = useMemo(() => {
    if (!Number.isFinite(remaining) || countdownSeconds === 0) {
      return 0;
    }
    const elapsed = countdownSeconds - remaining;
    return Math.max(0, Math.min(1, elapsed / countdownSeconds));
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
    <div className="relative flex h-full flex-col items-center justify-center gap-10">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),transparent_60%)]" />
        <div className="absolute inset-0 rotate-180 bg-[radial-gradient(circle_at_bottom,_rgba(244,114,182,0.12),transparent_55%)]" />
      </div>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-300">
          <span>MindSync</span>
          <span className="text-quadrant.b">#{stage}</span>
        </div>
        <h2 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
          Quadrante {stage}
        </h2>
        <p className="mt-3 text-base text-slate-300">
          {STAGE_LABELS[stage]} ·{" "}
          {remainingSeconds > 0 ? `${remainingSeconds}s` : "processando..."}
        </p>
        <div className="mt-4 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.35em]">
          {status.supported ? (
            <span className="text-slate-500">
              Intensidade do olhar: {(status.signal * 100).toFixed(0)}%
            </span>
          ) : (
            <span className="text-amber-400">
              Rastreio não suportado · modo manual liberado
            </span>
          )}
          {(lowSignal || debugMode) && (
            <span className="text-amber-300">
              Sinal fraco · MindReader escolheu automaticamente (clique para ajustar)
            </span>
          )}
        </div>

        <div className="mx-auto mt-6 h-2 w-60 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full origin-left rounded-full bg-gradient-to-r from-quadrant.a via-quadrant.b to-quadrant.d transition-transform duration-150 ease-out"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </div>

      <div
        ref={gridRef}
        className="relative grid h-[500px] w-full max-w-4xl grid-cols-2 grid-rows-2 gap-5"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-[2.4rem] border border-white/5 bg-gradient-to-br from-white/5 via-slate-900/30 to-slate-950/60 blur-3xl" />

        {quadrants.map((words, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleManualResolve(idx)}
            className={clsx(
              "group relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border px-6 py-8 text-center shadow-[0_0_25px_rgba(15,23,42,0.35)] transition duration-200",
              QUADRANT_BASE_STYLES[idx],
              highlight === idx &&
                "ring-2 ring-white/80 ring-offset-2 ring-offset-slate-950",
              highlight === idx && QUADRANT_GLOW_STYLES[idx],
              (debugMode || lowSignal) &&
                "hover:border-white/70 hover:bg-white/10 hover:text-white hover:shadow-[0_0_35px_rgba(148,163,184,0.35)]",
            )}
          >
            <span className="text-xs uppercase tracking-[0.4em] text-slate-400">
              Quadrante {idx + 1}
            </span>
            <ul
              className={clsx(
                "mt-4 space-y-2 text-lg font-semibold text-slate-100 transition-transform duration-150",
                stage === 2 && "text-2xl",
              )}
            >
              {words.map((word) => (
                <li key={word} className="transition group-hover:scale-[1.04]">
                  {word}
                </li>
              ))}
              {words.length === 0 && (
                <li className="text-sm font-normal uppercase tracking-[0.3em] text-slate-500">
                  aguardando
                </li>
              )}
            </ul>
            {(debugMode || lowSignal) && (
              <span className="mt-6 text-[0.65rem] uppercase tracking-[0.35em] text-slate-400">
                Clique para corrigir
              </span>
            )}
          </button>
        ))}
      </div>

      {(lowSignal || debugMode) && (
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
          Ferramenta de backup ativa · confirmação manual disponível
        </p>
      )}
    </div>
  );
}
