import type { ThemeKey } from "../data/themes";

export type AppPhase =
  | "intro"
  | "theme"
  | "first-look"
  | "second-look"
  | "reveal";

export interface QuadrantState {
  id: number;
  words: string[];
}

export interface TrackingSnapshot {
  quadrantId: number | null;
  confidence: number;
  timestamp: number;
}

export interface FocusResolution {
  index: number;
  confidence: number;
  source: "gaze" | "manual" | "low-signal";
}

export interface GameState {
  phase: AppPhase;
  theme: ThemeKey | null;
  initialQuadrants: QuadrantState[];
  focusHistory: TrackingSnapshot[];
  selectedQuadrant: number | null;
  finalSelection: QuadrantState | null;
  selectedWord: string | null;
  isDebugMode: boolean;
  countdownActive: boolean;
}
