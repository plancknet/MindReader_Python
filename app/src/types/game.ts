export type TopicKey = "fruta" | "animal" | "pais" | "profissao";

export type GameStage = "setup" | "grid" | "countdown" | "reveal";

export type Mode = "debug" | "production";

export interface TrackingSnapshot {
  quadrantId: number | null;
  confidence: number;
  timestamp: number;
  source: "gaze" | "low-signal";
}
