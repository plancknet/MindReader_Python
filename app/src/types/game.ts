export type ThemeKey = "countries" | "fruits" | "animals";

export type GameStage =
  | "welcome"
  | "webcam"
  | "theme"
  | "first-countdown"
  | "second-countdown"
  | "reveal";

export interface TrackingSnapshot {
  quadrantId: number | null;
  confidence: number;
  timestamp: number;
  source: "gaze" | "low-signal";
}
