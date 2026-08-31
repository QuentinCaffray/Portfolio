# syntax=docker/dockerfile:1

# ---- Étape 1 : build du site ------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Étape 2 : service statique --------------------------------------------
FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv

# Caddy n'écrit rien (admin off, auto_https off, persist_config off), mais on
# lui laisse quand même /config et /data et on tourne en utilisateur non-root.
RUN chown -R nobody:nobody /srv /config /data
USER nobody

# Railway fournit $PORT ; le Caddyfile écoute dessus (défaut 8080 en local).
EXPOSE 8080
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
