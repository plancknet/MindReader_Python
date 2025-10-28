# MindReader 🧠✨

Aplicação experimental que simula leitura de mente a partir do rastreio do olhar. Selecione um tema, fixe o olhar na palavra desejada e deixe o MindReader adivinhar o que você pensou.

## Destaques

- Rastreamento ocular em ~60 fps via [WebGazer](https://webgazer.cs.brown.edu/) com inferência de quadrante reproduzindo o projeto MindReader_Python.
- Fluxo inspirado no **Eye Think-er**: tela de boas-vindas, calibração da webcam, seleção de tema, duas contagens regressivas e revelação animada.
- Interface responsiva com Tailwind CSS, gradientes por quadrante e animações usando Framer Motion.
- Fallback automático: se o sinal do olhar estiver fraco, o sistema seleciona o quadrante mais provável e registra a confiança para auditoria.
- Listas de exemplo com 30+ palavras para **Países**, **Frutas** e **Animais**.
- Dockerfile para build estático (servido por Nginx) e workflow GitHub Actions (`preview.yml`) que gera artefato do diretório `dist`.

## Tecnologias

- [React + Vite + TypeScript](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/) + `tailwindcss-animate`
- [react-router-dom](https://reactrouter.com/) para navegação
- [WebGazer](https://www.npmjs.com/package/webgazer) + hooks personalizados de rastreio
- [Framer Motion](https://www.framer.com/motion/) para a revelação final

## Executando localmente

```bash
npm install
npm run dev
```

> O Vite sobe em `http://localhost:5173`. Conceda acesso à webcam, enquadre o rosto e siga as instruções na tela.

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

## Fluxo do jogo

1. **Boas-vindas** – visão geral e checklist rápido do processo.
2. **Calibração** – tela de webcam com orientações para mover os olhos pelos cantos.
3. **Tema** – escolha visual (Países, Frutas ou Animais) inspirada no Eye Think-er.
4. **Primeira contagem** – 16 palavras em 4 quadrantes; após 5 s o quadrante mais observado é escolhido automaticamente.
5. **Segunda contagem** – 4 palavras (uma por quadrante); novo rastreio de olhar, mesma lógica de decisão.
6. **Revelação** – animação com destaque da palavra detectada e mensagem “Sua mente foi lida com sucesso!”.

Se o rastreio falhar, o algoritmo escolhe o quadrante mais provável com base na contagem de amostras e registra a confiança e o nível de sinal para debugging.

## Estrutura de diretórios

```
src/
  components/     # UI modular (boas-vindas, calibração, grids, countdown, revelação)
  data/           # Temas e listas de palavras
  hooks/          # Hooks para contagem regressiva e rastreio de olhar
  pages/          # Fluxo principal (Index) + fallback 404
  services/       # Integração com WebGazer (gazeTracker)
  utils/          # Constantes e helpers
```

## CI

`.github/workflows/preview.yml` executa `npm ci` + `npm run build` em Node 20.19 e publica o diretório `dist` como artefato para testes rápidos.

---

### Boas práticas de uso

- Iluminação frontal uniforme e poucos reflexos ajudam o rastreio.
- Ajuste o enquadramento da câmera até que o rosto fique centralizado na etapa de calibração.
- Evite mover a cabeça durante as contagens regressivas; apenas os olhos devem se mover.
