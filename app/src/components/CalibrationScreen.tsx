import { useEffect, useRef, useState } from "react";
import { useGazeTracking } from "../hooks/useGazeTracking";
import { GazeVideoFeed } from "./GazeVideoFeed";
import { WordGrid } from "./WordGrid";

interface CalibrationScreenProps {
  onContinue: () => void;
}

const CALIBRATION_WORDS = ["Norte", "Leste", "Sul", "Oeste"];

export function CalibrationScreen({ onContinue }: CalibrationScreenProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const [highlight, setHighlight] = useState<number | null>(null);
  const { point } = useGazeTracking({ enabled: true });

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
    if (!point) {
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
    setHighlight(row * 2 + column);
  }, [point]);

  return (
    <div className="grid min-h-[70vh] gap-10 md:grid-cols-[1fr_1.1fr] md:items-center">
      <div className="space-y-6 animate-fade-in">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-300">
          <span>Etapa 2</span>
          <span className="text-quadrant.b">Calibracao</span>
        </div>
        <h2 className="text-4xl font-semibold text-white md:text-5xl">
          Mova o olhar entre os quatro cantos para calibrar.
        </h2>
        <p className="max-w-xl text-base text-slate-300 md:text-lg">
          Passe alguns segundos em cada quadrante. Observe se o destaque acompanha
          seus movimentos antes de seguir adiante.
        </p>

        <div className="flex items-center justify-center">
          <GazeVideoFeed
            active
            className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/10 shadow-[0_0_55px_rgba(56,189,248,0.25)]"
          />
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="rounded-full bg-gradient-to-r from-quadrant.b to-quadrant.d px-10 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-900 shadow-[0_0_45px_rgba(56,189,248,0.35)] transition hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-quadrant.b"
        >
          Iniciar leitura
        </button>
      </div>

      <div className="flex h-full flex-1 items-center justify-center">
        <WordGrid
          ref={gridRef}
          words={CALIBRATION_WORDS}
          highlightQuadrant={highlight}
          interactive={false}
          showHighlight
          className="aspect-[4/3] h-full max-h-[calc(100vh-220px)] min-h-[240px] gap-8 sm:gap-12"
        />
      </div>
    </div>
  );
}
