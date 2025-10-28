import type { ThemeDefinition } from "../data/themes";
import { partition, pickRandom } from "./random";

export const buildInitialQuadrants = (theme: ThemeDefinition): string[][] => {
  const words = pickRandom(theme.words, 16);
  return partition(words, 4).map((chunk) => [...chunk]);
};

export const buildFinalQuadrants = (words: string[]): string[][] => {
  const items = [...words];
  while (items.length < 4) {
    items.push("");
  }
  return items.map((word) => (word ? [word] : []));
};
