import { useEffect, useRef, useState } from "react";
import {
  gazeTracker,
  type GazePoint,
  type GazeStatus,
} from "../services/gazeTracker";

export interface UseGazeTrackingOptions {
  enabled: boolean;
}

interface UseGazeTrackingResult {
  point: GazePoint | null;
  status: GazeStatus;
}

export function useGazeTracking({
  enabled,
}: UseGazeTrackingOptions): UseGazeTrackingResult {
  const [point, setPoint] = useState<GazePoint | null>(null);
  const [status, setStatus] = useState<GazeStatus>(gazeTracker.status);
  const stopOnDisableRef = useRef(true);

  useEffect(() => {
    stopOnDisableRef.current = true;
  }, []);

  useEffect(() => {
    let mounted = true;

    if (!enabled) {
      setPoint(null);
      if (stopOnDisableRef.current) {
        gazeTracker.stop().catch(() => undefined);
      }
      setStatus(gazeTracker.status);
      return () => {
        mounted = false;
      };
    }

    gazeTracker
      .start()
      .then((success) => {
        if (!mounted) {
          return;
        }
        if (!success) {
          setStatus(gazeTracker.status);
        }
      })
      .catch(() => {
        if (mounted) {
          setStatus(gazeTracker.status);
        }
      });

    const unsubscribe = gazeTracker.subscribe((latest) => {
      if (!mounted) {
        return;
      }
      setPoint(latest);
      setStatus(gazeTracker.status);
    });

    const interval = window.setInterval(() => {
      if (!mounted) {
        return;
      }
      setStatus(gazeTracker.status);
    }, 250);

    return () => {
      mounted = false;
      window.clearInterval(interval);
      unsubscribe();
    };
  }, [enabled]);

  return { point, status };
}
