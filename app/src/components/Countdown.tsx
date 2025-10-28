import { useEffect, useMemo, useRef, useState } from "react";
import { useCountdown } from "../hooks/useCountdown";
import { useGazeTracking } from "../hooks/useGazeTracking";
import { WordGrid } from "./WordGrid";

interface CountdownProps {
  words: string[];
  duration?: number;
  onComplete: (quadrant: number, info: { confidence: number; signal: number }) => void;
  title?: string;
  showHighlight?: boolean;
}

export function Countdown({
  words,
  duration = 5,
  onComplete,
  title = "Fixe seu olhar na palavra escolhida",
  showHighlight = true,
}: CountdownProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const countsRef = useRef([0, 0, 0, 0]);
  const [highlight, setHighlight] = useState<number | null>(null);
  const statusRef = useRef({ signal: 0 });

  const { point, status } = useGazeTracking({ enabled: true });
  statusRef.current = status;

  const handleCountdownFinish = () => {
    const counts = countsRef.current;
    const total = counts.reduce((sum, value) => sum + value, 0);
    const bestValue = Math.max(...counts);
    const bestIndex = total > 0 ? counts.indexOf(bestValue) : 0;
    const confidence = total > 0 ? bestValue / total : 0;
    onComplete(bestIndex, {
      confidence,
      signal: statusRef.current.signal,
    });
  };

  const { remaining, isRunning, start, reset } = useCountdown({
    seconds: duration,
    autoStart: false,
    onComplete: handleCountdownFinish,
  });

  useEffect(() => {
    countsRef.current = [0, 0, 0, 0];
    setHighlight(null);
    reset();
    const timer = setTimeout(() => {
      start();
    }, 800);
    return () => clearTimeout(timer);
  }, [words, reset, start]);

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

    const column = relativeX < bounds.width / 2 ? 0 : 1;
    const row = relativeY < bounds.height / 2 ? 0 : 1;
    const quadrant = row * 2 + column;

    setHighlight(quadrant);
    countsRef.current[quadrant] += 1;
  }, [isRunning, point]);

  const remainingSeconds = useMemo(() => Math.ceil(remaining), [remaining]);

  return (
    <div className="flex w-full flex-1 flex-col gap-6">
      <div className="text-center text-sm uppercase tracking-[0.4em] text-slate-400">
        {remainingSeconds > 0 ? title : "Processando leitura..."}
      </div>

      <div className="relative flex flex-1 items-center justify-center px-2 pb-4 sm:px-0">
        <WordGrid
          ref={gridRef}
          words={words}
          highlightQuadrant={highlight}
          interactive={false}
          showHighlight={showHighlight}
          className="h-full max-h-[calc(100vh-220px)] min-h-[220px] max-w-6xl gap-8 sm:gap-12"
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white/30 bg-white/10 text-4xl font-bold text-white shadow-[0_0_45px_rgba(56,189,248,0.35)] sm:h-40 sm:w-40 sm:text-5xl">
            {remainingSeconds > 0 ? remainingSeconds : "🧠"}
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.35em] text-slate-400">
          Sinal do olhar: {(status.signal * 100).toFixed(0)}%
        </div>
      </div>
    </div>
  );
}
