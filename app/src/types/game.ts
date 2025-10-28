export type GameStage = "setup" | "calibration" | "countdown" | "reveal";

export type Mode = "debug" | "production";

export interface TrackingSnapshot {
  quadrantId: number | null;
  confidence: number;
  timestamp: number;
  source: "gaze" | "low-signal";
}
