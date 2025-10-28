# MindReader

Simulacao de leitura mental com rastreamento de olhar. O fluxo segue quatro telas:

1. **Configuracao** – escolha a paleta visual e o modo (Debug ou Producao).
2. **Calibracao** – ajuste o olhar em cada quadrante com a webcam ativa.
3. **Leitura** – contagem esferica central enquanto quatro quadrantes espacado geram a probabilidade de foco.
4. **Resultado** – palavra detectada e botao para reiniciar.

## Destaques

- Rastreio ocular ~60 fps via [WebGazer](https://webgazer.cs.brown.edu/) com coleta de confianca e sinal.
- Paletas configuraveis (`data/palettes.ts`) aplicadas dinamicamente em variaveis CSS.
- Modo **Debug** destaca o quadrante focado; modo **Producao** deixa a interface discreta.
- Layout responsivo (sem rolagem) com Tailwind CSS e `tailwindcss-animate`.
- Palavras aleatorias vindas de `data/words.ts`.

## Tecnologias

- React + Vite + TypeScript
- Tailwind CSS + `tailwindcss-animate`
- `react-router-dom`
- WebGazer

## Executando

```bash
npm install
npm run dev
```

Build estatico / preview:

```bash
npm run build
npm run preview
```

### Docker

```bash
docker build -t mindreader .
docker run -p 8080:80 mindreader
```

## Estrutura

```
src/
  components/
    CalibrationScreen.tsx   # Etapa 2
    Countdown.tsx           # Etapa 3 (contagem + quadrantes)
    MindReveal.tsx          # Etapa 4
    SetupScreen.tsx         # Etapa 1
    GazeVideoFeed.tsx       # Container reutilizavel do feed de webcam
    WordGrid.tsx            # Quadrantes com controle de destaque
  data/
    palettes.ts             # Paletas disponiveis
    words.ts                # Palavras base
  hooks/                    # useCountdown, useGazeTracking
  pages/
    Index.tsx               # Orquestra o fluxo e estados
  services/
    gazeTracker.ts          # Wrapper WebGazer com controle de preview
  utils/
    constants.ts            # Constantes (ex.: numero de quadrantes)
```

## Observacoes de uso

- Na calibracao o feed da camera permanece visivel; na leitura ele e ocultado automaticamente.
- A contagem central gera a probabilidade de foco; o quadrante com maior tempo acumulado vence.
- Reiniciar retorna para a tela de configuracao preservando a paleta atual.

