import type { ThemeKey } from "../types";

export interface ThemeDefinition {
  label: string;
  words: string[];
}

export const THEMES: Record<ThemeKey, ThemeDefinition> = {
  countries: {
    label: "Países",
    words: [
      "Brasil",
      "Argentina",
      "Chile",
      "Peru",
      "Colômbia",
      "Uruguai",
      "Paraguai",
      "México",
      "Canadá",
      "Estados Unidos",
      "Portugal",
      "Espanha",
      "França",
      "Itália",
      "Alemanha",
      "Reino Unido",
      "Irlanda",
      "Suécia",
      "Noruega",
      "Dinamarca",
      "Japão",
      "China",
      "Coreia do Sul",
      "Índia",
      "Austrália",
      "Nova Zelândia",
      "África do Sul",
      "Egito",
      "Marrocos",
      "Turquia",
      "Grécia",
      "Tailândia",
      "Indonésia",
      "Filipinas",
      "Vietnã",
    ],
  },
  fruits: {
    label: "Frutas",
    words: [
      "Maçã",
      "Banana",
      "Laranja",
      "Abacaxi",
      "Manga",
      "Uva",
      "Melancia",
      "Melão",
      "Kiwi",
      "Morango",
      "Amora",
      "Framboesa",
      "Pêssego",
      "Ameixa",
      "Maracujá",
      "Coco",
      "Limão",
      "Tangerina",
      "Pera",
      "Cereja",
      "Graviola",
      "Pitaya",
      "Jabuticaba",
      "Caju",
      "Acerola",
      "Figo",
      "Romã",
      "Goiaba",
      "Carambola",
      "Abacate",
      "Nectarina",
      "Cupuaçu",
      "Açaí",
      "Mirtilo",
      "Physalis",
    ],
  },
  animals: {
    label: "Animais",
    words: [
      "Leão",
      "Tigre",
      "Elefante",
      "Girafa",
      "Zebra",
      "Rinoceronte",
      "Hipopótamo",
      "Macaco",
      "Gorila",
      "Urso",
      "Lobo",
      "Raposa",
      "Canguru",
      "Koala",
      "Panda",
      "Golfinho",
      "Baleia",
      "Tubarão",
      "Polvo",
      "Águia",
      "Falcão",
      "Papagaio",
      "Coruja",
      "Lhama",
      "Capivara",
      "Onça",
      "Jacaré",
      "Cobra",
      "Tartaruga",
      "Lontra",
      "Foca",
      "Pinguim",
      "Tamanduá",
      "Quati",
    ],
  },
};

export const getRandomWords = (theme: ThemeKey, count: number): string[] => {
  const pool = [...THEMES[theme].words];
  const result: string[] = [];

  for (let i = 0; i < count && pool.length > 0; i += 1) {
    const index = Math.floor(Math.random() * pool.length);
    result.push(pool[index]);
    pool.splice(index, 1);
  }

  return result;
};
