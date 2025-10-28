import clsx from "clsx";
import { forwardRef } from "react";

interface WordGridProps {
  words: string[];
  highlightQuadrant?: number | null;
  interactive?: boolean;
  onQuadrantClick?: (quadrant: number) => void;
  className?: string;
  showHighlight?: boolean;
}

const quadrantClassNames = [
  "quadrant-1",
  "quadrant-2",
  "quadrant-3",
  "quadrant-4",
];

const getQuadrantWords = (words: string[], quadrant: number): string[] => {
  if (words.length === 16) {
    const start = quadrant * 4;
    return words.slice(start, start + 4);
  }
  if (words.length === 4) {
    return [words[quadrant]];
  }
  const chunkSize = Math.ceil(words.length / 4);
  const start = quadrant * chunkSize;
  return words.slice(start, start + chunkSize);
};

export const WordGrid = forwardRef<HTMLDivElement, WordGridProps>(
  ({
    words,
    highlightQuadrant = null,
    interactive = false,
    onQuadrantClick,
    className,
    showHighlight = true,
  }, ref) => (
    <div
      ref={ref}
      className={clsx(
        "word-grid-container grid min-h-0 w-full max-w-5xl grid-cols-2 grid-rows-2 gap-3 px-2 sm:gap-4 sm:px-0",
        className,
      )}
    >
      {[0, 1, 2, 3].map((quadrant) => {
        const quadrantWords = getQuadrantWords(words, quadrant);
        const isCurrentHighlighted = highlightQuadrant === quadrant;
        const shouldHighlight = showHighlight && isCurrentHighlighted;

        return (
          <button
            key={quadrant}
            type="button"
            onClick={() => onQuadrantClick?.(quadrant)}
            disabled={!interactive}
            className={clsx(
              quadrantClassNames[quadrant],
              "relative flex h-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/15 p-4 shadow-[0_0_35px_rgba(15,23,42,0.35)] transition duration-200",
              interactive
                ? "cursor-pointer hover:scale-[1.02]"
                : "cursor-default",
              shouldHighlight
                ? "scale-[1.02] ring-4 ring-white/50"
                : "scale-100",
            )}
          >
            <div className="pointer-events-none absolute inset-0 bg-black/25" />
            <div className="relative flex h-full flex-col items-center justify-center gap-3 text-center">
              {quadrantWords.map((word, index) => (
                <span
                  key={word ?? `${quadrant}-${index}`}
                  className={clsx(
                    "rounded-xl bg-black/25 px-4 py-3 font-semibold text-white backdrop-blur-sm transition duration-200",
                    words.length === 4
                      ? "text-3xl sm:text-4xl"
                      : "text-lg sm:text-xl",
                    shouldHighlight ? "scale-[1.05]" : "scale-100",
                  )}
                >
                  {word}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  ),
);

WordGrid.displayName = "WordGrid";
