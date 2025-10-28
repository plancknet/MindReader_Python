# syntax=docker/dockerfile:1

FROM node:20.19.0-alpine AS builder
WORKDIR /app

# pegue os manifests a partir do contexto (que está na raiz 'code/')
COPY app/package*.json ./
RUN npm ci || npm install

# agora traga o resto do código
COPY app/ ./
RUN npm run build

FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
