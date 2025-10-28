import type { WebGazerInstance, WebGazerPrediction } from "webgazer";

type Listener = (point: GazePoint | null) => void;

export interface GazePoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface GazeStatus {
  supported: boolean;
  active: boolean;
  signal: number;
}

const isBrowser = typeof window !== "undefined";
const isSupported =
  isBrowser &&
  typeof navigator !== "undefined" &&
  !!navigator.mediaDevices &&
  typeof navigator.mediaDevices.getUserMedia === "function";

class GazeTracker {
  private instance: WebGazerInstance | null = null;

  private listeners = new Set<Listener>();

  private latestPoint: GazePoint | null = null;

  private history: number[] = [];

  private active = false;

  private loading: Promise<WebGazerInstance | null> | null = null;

  private emit(point: GazePoint | null) {
    this.listeners.forEach((listener) => listener(point));
  }

  private handlePrediction = (
    data: WebGazerPrediction | null,
    timestamp: number,
  ) => {
    if (!this.active) {
      return;
    }

    if (data) {
      this.latestPoint = { x: data.x, y: data.y, timestamp };
      this.history.push(timestamp);
      this.emit(this.latestPoint);
    } else {
      this.history.push(Number.NaN);
      this.emit(null);
    }

    this.compactHistory(timestamp);
  };

  private compactHistory(currentTimestamp?: number) {
    const now = currentTimestamp ?? (isBrowser ? performance.now() : Date.now());
    const windowMs = 1200;
    this.history = this.history.filter(
      (entry) => !Number.isNaN(entry) && now - entry <= windowMs,
    );
  }

  private async loadInstance(): Promise<WebGazerInstance | null> {
    if (!isSupported) {
      return null;
    }

    if (this.instance) {
      return this.instance;
    }

    if (this.loading) {
      return this.loading;
    }

    this.loading = import("webgazer")
      .then((module) => {
        const webgazerInstance = (module.default ?? module) as WebGazerInstance;

        if (webgazerInstance.params) {
          webgazerInstance.params.showVideoPreview = true;
          webgazerInstance.params.showFaceOverlay = false;
          webgazerInstance.params.showFaceFeedbackBox = false;
          webgazerInstance.params.saveDataAcrossSessions = false;
        }

        return webgazerInstance;
      })
      .catch(() => null);

    this.instance = await this.loading;
    this.loading = null;
    return this.instance;
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    if (this.latestPoint) {
      listener(this.latestPoint);
    }
    return () => {
      this.listeners.delete(listener);
    };
  }

  async start() {
    if (!isSupported) {
      return false;
    }

    const webgazer = await this.loadInstance();
    if (!webgazer) {
      return false;
    }

    if (this.active) {
      return true;
    }

    this.active = true;
    this.history = [];

    webgazer.removeMouseEventListeners?.();
    webgazer.showPredictionPoints?.(false);
    webgazer.showVideoPreview?.(true);
    webgazer.setGazeListener(this.handlePrediction);

    try {
      await webgazer.begin();
      return true;
    } catch {
      this.active = false;
      return false;
    }
  }

  async stop() {
    if (!this.instance || !this.active) {
      return;
    }

    this.active = false;
    this.instance.setGazeListener?.(() => null);
    try {
      await this.instance.end();
    } catch {
      // ignore
    }
    this.latestPoint = null;
    this.history = [];
  }

  getSignalStrength() {
    this.compactHistory();
    const validSamples = this.history.length;
    // Assume 60fps target updates. Clamp between 0 and 1.
    return Math.max(0, Math.min(validSamples / 60, 1));
  }

  get status(): GazeStatus {
    return {
      active: this.active,
      supported: isSupported,
      signal: this.getSignalStrength(),
    };
  }
}

export const gazeTracker = new GazeTracker();
