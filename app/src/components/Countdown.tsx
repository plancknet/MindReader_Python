import { useEffect, useMemo, useRef, useState } from "react";
import { useCountdown } from "../hooks/useCountdown";
import { useGazeTracking } from "../hooks/useGazeTracking";
import { WordGrid } from "./WordGrid";

interface CountdownProps {
  words: string[];
  duration?: number;
  onComplete: (quadrant: number, info: { confidence: number; signal: number }) => void;
  title?: string;
}

export function Countdown({
  words,
  duration = 5,
  onComplete,
  title = "Fixe seu olhar na palavra escolhida",
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
    <div className="flex w-full flex-1 flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-3 text-center animate-fade-in">
        <h2 className="text-xl font-semibold text-slate-200 sm:text-2xl md:text-3xl">
          {remainingSeconds > 0 ? title : "Lendo sua mente..."}
        </h2>
        {remainingSeconds > 0 ? (
          <div className="text-6xl font-bold text-primary animate-pulse-glow sm:text-7xl md:text-8xl">
            {remainingSeconds}
          </div>
        ) : (
          <div className="text-4xl text-slate-300 animate-pulse">🧠✨</div>
        )}
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
          Sinal do olhar: {(status.signal * 100).toFixed(0)}%
        </p>
      </div>

      <div className="flex w-full flex-1 items-center justify-center px-2 pb-4 sm:px-0">
        <WordGrid
          ref={gridRef}
          words={words}
          highlightQuadrant={highlight}
          interactive={false}
          className="aspect-[4/3] h-full max-h-[calc(100vh-220px)] min-h-[200px]"
        />
      </div>
    </div>
  );
}
