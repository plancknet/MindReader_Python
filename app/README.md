# MindReader 👁️‍🗨️

Aplicação experimental que simula leitura de mente através do rastreio do olhar. Escolha um tema, fixe o olhar nos quadrantes e deixe o MindReader adivinhar a palavra pensada.

## Funcionalidades

- Rastreamento de olhar em ~60fps com [WebGazer](https://webgazer.cs.brown.edu/), incluindo detecção de quadrante mais observado.
- Fluxo em duas etapas: seleção de 16 palavras em quadrantes 2x2 e etapa final com quatro palavras (uma por quadrante).
- Interface responsiva com TailwindCSS, realces visuais para o quadrante dominante e animações de foco via framer-motion.
- Fallback em "modo debug": caso a câmera não responda ou a confiança caia, é possível confirmar o quadrante manualmente com um clique.
- Listas de palavras (≥30 itens) para os temas **Países**, **Frutas** e **Animais**.
- Dockerfile pronto para build/servidor estático e workflow GitHub Actions (`preview.yml`) que gera artefato de build automaticamente.

## Tecnologias

- [React + Vite + TypeScript](https://vite.dev/)
- [TailwindCSS](https://tailwindcss.com/) para layout responsivo
- [webgazer](https://www.npmjs.com/package/webgazer) para rastreamento ocular
- [framer-motion](https://www.framer.com/motion/) para animações

## Como executar

### Ambiente local

```bash
npm install
npm run dev
```

> O Vite abrirá em `http://localhost:5173`. Conceda acesso à webcam, enquadre o rosto e siga as instruções na tela.

Para gerar o build estático:

```bash
npm run build
npm run preview
```

### Via Docker

```bash
docker build -t mindreader .
docker run -p 8080:80 mindreader
```

O bundle será servido pelo Nginx em `http://localhost:8080`.

## Fluxo de uso

1. **Conectar a mente** – ativa a câmera (elemento `webgazerVideoFeed` realocado para a UI) e exibe instruções.
2. **Selecionar Tema** – escolha visualmente entre Países, Frutas ou Animais (cada botão corresponde a um quadrante).
3. **Quadrante 1** – conta regressiva de 5 segundos para capturar o quadrante dominante dentre 16 palavras.
4. **Quadrante 2** – as quatro palavras restantes são reordenadas (uma por quadrante) e o processo é repetido.
5. **Revelação** – animação pulsante destaca a palavra prevista e confirma: “Sua mente foi lida com sucesso! 🧠✨”.

Se nenhuma coordenada confiável for capturada, o modo debug é ativado automaticamente e um aviso instrui a seleção manual com o mouse.

## Estrutura principal

```
src/
  components/
    screens/     → telas do fluxo (intro, temas, quadrantes, revelação)
    ui/          → componentes utilitários (ex.: GazeVideoFeed)
  data/          → listas de palavras por tema
  hooks/         → hooks customizados (contagem e rastreio)
  services/      → integração com WebGazer
  utils/         → helpers de jogo e aleatoriedade
```

## CI

`.github/workflows/preview.yml` executa `npm ci` + `npm run build` em Node 20.19 e publica o diretório `dist` como artefato, facilitando deploys de teste.

---

### Dicas

- Use iluminação frontal uniforme e ajuste o enquadramento até que o vídeo esteja centralizado.
- Caso o navegador negue acesso à câmera, o modo debug fica disponível depois que a contagem encerra.
