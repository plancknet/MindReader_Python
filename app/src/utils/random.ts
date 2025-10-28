export const shuffle = <T>(values: T[]): T[] => {
  const array = [...values];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const pickRandom = <T>(values: T[], count: number): T[] => {
  if (count >= values.length) {
    return shuffle(values);
  }
  return shuffle(values).slice(0, count);
};

export const partition = <T>(values: T[], chunkSize: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < values.length; i += chunkSize) {
    result.push(values.slice(i, i + chunkSize));
  }
  return result;
};
