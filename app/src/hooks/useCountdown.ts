import { useCallback, useEffect, useRef, useState } from "react";

export interface UseCountdownOptions {
  seconds: number;
  autoStart?: boolean;
  onComplete?: () => void;
}

interface UseCountdownResult {
  remaining: number;
  isRunning: boolean;
  start: () => void;
  reset: () => void;
}

export function useCountdown({
  seconds,
  autoStart = false,
  onComplete,
}: UseCountdownOptions): UseCountdownResult {
  const [remaining, setRemaining] = useState(seconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const startTimestampRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const tick = (timestamp: number) => {
      if (startTimestampRef.current === null) {
        startTimestampRef.current = timestamp;
      }

      const elapsed = (timestamp - startTimestampRef.current) / 1000;
      const nextRemaining = Math.max(0, seconds - elapsed);
      setRemaining(nextRemaining);

      if (nextRemaining <= 0) {
        setIsRunning(false);
        startTimestampRef.current = null;
        rafRef.current = null;
        onComplete?.();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isRunning, onComplete, seconds]);

  const start = useCallback(() => {
    startTimestampRef.current = null;
    setRemaining(seconds);
    setIsRunning(true);
  }, [seconds]);

  const reset = useCallback(() => {
    startTimestampRef.current = null;
    setRemaining(seconds);
    setIsRunning(false);
  }, [seconds]);

  useEffect(() => {
    if (autoStart) {
      start();
    }
  }, [autoStart, start]);

  return { remaining, isRunning, start, reset };
}
