# Etap budowy
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NUXT_CSP_API_URL=$NUXT_CSP_API_URL
ENV NUXT_PUBLIC_API_URL=$NUXT_PUBLIC_API_URL

RUN npm run build

# Etap produkcyjny - lekki obraz do uruchomienia SSR Nuxt
FROM node:18-alpine AS production

WORKDIR /app

# Kopiuj build i dependencies z etapu budowy
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

RUN npm install pm2 -g

# AWS ECS zazwyczaj oczekuje aplikacji na porcie 8080
ENV PORT 8080
ENV HOST 0.0.0.0

ENV NITRO_PORT 8080
ENV NITRO_HOST 0.0.0.0

ENV NUXT_CSP_API_URL=https://forum.tomasz-slapinski.pl
ENV NUXT_PUBLIC_API_URL=https://forum.tomasz-slapinski.pl/api

EXPOSE 8080

# Uruchom Nuxt SSR na porcie 8080 wykorzystując zmienną środowiskową PORT
CMD ["pm2-runtime", "start", ".output/server/index.mjs"]
