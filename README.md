# Portfolio — Quentin Caffray

Portfolio personnel d'un développeur full stack JavaScript / React. Site statique,
sans backend ni authentification.

Trois applications en service y sont présentées : **La Popote** (caisse commune
d'une brigade de gendarmerie), **The Crew** (pilotage d'une boutique Orange),
**DPE simplifié** (vulgarisation de rapports de diagnostic énergétique par IA).

## Stack

| Élément | Choix |
|---|---|
| Build | Vite 6 + React 18 + TypeScript strict |
| Styles | TailwindCSS 3 (tokens du système de design en config) |
| Routing | React Router 7 (SPA) |
| Contenu | Statique, typé — `src/content/` |
| Polices | Bricolage Grotesque, Instrument Sans, JetBrains Mono — auto-hébergées |
| Tests | Vitest + Testing Library |
| Runtime prod | Image Docker multi-stage : build Node → Caddy |
| Hébergement | Railway |

## Développement

```bash
npm install
npm run dev          # http://localhost:5180
```

Autres scripts : `npm run build`, `npm run preview`, `npm run lint`,
`npm run typecheck`, `npm test`.

## Structure

```
src/
├── content/        projects.ts + site.ts — toute la copy du site
├── hooks/          useDraggableCards.ts — les fiches projet déplaçables
├── lib/            hooks utilitaires (reduced-motion, meta par route, scroll)
├── components/
│   ├── layout/     en-tête, pied de page, pastilles de navigation
│   ├── home/        hero, tableau, méthode, à-propos
│   └── project/     en-tête de fiche, blocs alternés, navigation suivante
└── pages/          HomePage, ProjectPage, NotFoundPage
```

## Déploiement

Image Docker (`Dockerfile`) : le build Vite est servi par Caddy, qui applique les
en-têtes de sécurité (`Caddyfile` — CSP, HSTS, `X-Content-Type-Options`,
`Permissions-Policy`, fallback SPA) et tourne en utilisateur non-root.

```bash
railway up           # build + déploiement (builder DOCKERFILE, cf. railway.json)
railway domain       # génère l'URL publique
```

Caddy écoute sur `$PORT` (fourni par Railway, `8080` par défaut en local).

## Sécurité

Site statique, surface d'attaque minimale. Posture OWASP : `npm audit` à zéro,
en-têtes durcis via Caddy, liens externes en `rel="noopener noreferrer"`, pas de
`dangerouslySetInnerHTML`, aucun secret dans le dépôt.
