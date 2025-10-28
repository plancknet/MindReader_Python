import type { TopicKey } from "../types";

export const TOPIC_LABELS: Record<TopicKey, string> = {
  fruta: "Fruta",
  animal: "Animal",
  pais: "Pais",
  profissao: "Profissao",
};

const TOPIC_WORDS: Record<TopicKey, string[]> = {
  fruta: [
    "Maca", "Banana", "Laranja", "Abacaxi", "Manga", "Uva", "Melancia", "Melao",
    "Kiwi", "Morango", "Amora", "Framboesa", "Pessego", "Ameixa", "Maracuja", "Coco",
    "Limao", "Tangerina", "Pera", "Cereja", "Graviola", "Pitaya", "Jabuticaba", "Caju",
    "Acerola", "Figo", "Roma", "Goiaba", "Carambola", "Abacate", "Nectarina", "Cupuacu",
    "Acai", "Mirtilo", "Physalis"
  ],
  animal: [
    "Leao", "Tigre", "Elefante", "Girafa", "Zebra", "Rinoceronte", "Hipopotamo", "Macaco",
    "Gorila", "Urso", "Lobo", "Raposa", "Canguru", "Koala", "Panda", "Golfinho",
    "Baleia", "Tubarao", "Polvo", "Aguia", "Falcao", "Papagaio", "Coruja", "Lhama",
    "Capivara", "Onca", "Jacare", "Cobra", "Tartaruga", "Lontra", "Foca", "Pinguim",
    "Tamandua", "Quati", "Ornitorrinco"
  ],
  pais: [
    "Brasil", "Argentina", "Chile", "Peru", "Colombia", "Uruguai", "Paraguai", "Mexico",
    "Canada", "Estados Unidos", "Portugal", "Espanha", "Franca", "Italia", "Alemanha", "Reino Unido",
    "Irlanda", "Suecia", "Noruega", "Dinamarca", "Japao", "China", "Coreia do Sul", "India",
    "Australia", "Nova Zelandia", "Africa do Sul", "Egito", "Marrocos", "Turquia", "Grecia",
    "Tailandia", "Indonesia", "Filipinas", "Vietna"
  ],
  profissao: [
    "Medico", "Professor", "Engenheiro", "Advogado", "Arquiteto", "Designer", "Programador", "Enfermeiro",
    "Jornalista", "Chef", "Piloto", "Farmaceutico", "Dentista", "Veterinario", "Fotografo", "Cientista",
    "Psicologo", "Eletricista", "Pedreiro", "Motorista", "Contador", "Chefe de cozinha", "Artista", "Mecanico",
    "Empreendedor", "Barbeiro", "Biologo", "Geologo", "Escritor", "Secretario", "Tradutor", "Analista",
    "Estilista", "Agricultor", "Publicitario"
  ],
};

export const getTopicWords = (topic: TopicKey, count: number): string[] => {
  const pool = [...TOPIC_WORDS[topic]];
  const result: string[] = [];

  for (let i = 0; i < count && pool.length > 0; i += 1) {
    const index = Math.floor(Math.random() * pool.length);
    result.push(pool[index]);
    pool.splice(index, 1);
  }

  return result;
};
