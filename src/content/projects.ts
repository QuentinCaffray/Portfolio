/**
 * Source de vérité des trois projets présentés.
 * Copy reprise du handoff (design_handoff_portfolio/README.md) pour La Popote ;
 * The Crew et DPE simplifié rédigés sur le même modèle à partir de leurs
 * PRD / README respectifs.
 *
 * Les champs `figures` marqués `todo: true` sont des emplacements à compléter
 * par Quentin (chiffres d'usage réels) — ils ne sont jamais rendus comme un
 * chiffre définitif.
 */

export type ProjectSlug = "la-popote" | "the-crew" | "dpe-simplifie";

export interface ProjectFigure {
  value: string;
  label: string;
  todo?: boolean;
}

export interface ProjectScreenshot {
  src: string;
  alt: string;
  caption: string;
  /** true = capture pas encore disponible, on affiche un cadre neutre */
  placeholder?: boolean;
  /** `object-position` du cadrage (ex. "left 28%") pour la vignette de fiche */
  focus?: string;
}

export interface Project {
  slug: ProjectSlug;
  order: string;
  name: string;
  statusLabel: string;
  statusAccent: boolean;
  cardColor: "sand" | "sage" | "slate";
  initialRotation: number;
  summary: string;
  intro: string;
  cardMeta: { contexte: string; role: string; usage: string };
  meta: { contexte: string; role: string; stack: string; statut: string };
  figures: ProjectFigure[];
  technical: { label: string; body: string };
  blocks: { demande: string; change: string };
  screenshots: {
    card: ProjectScreenshot;
    demande: ProjectScreenshot;
    change: ProjectScreenshot;
  };
  repoUrl: string;
  next: ProjectSlug;
}

const laPopote: Project = {
  slug: "la-popote",
  order: "01",
  name: "La Popote",
  statusLabel: "En service",
  statusAccent: true,
  cardColor: "sand",
  initialRotation: -0.4,
  summary:
    "La caisse commune d'une brigade de gendarmerie : café, consommables et cotisations mensuelles, suivis au centime.",
  intro:
    "La caisse café d'une brigade se tenait sur un carnet et de la monnaie dans une boîte. Personne ne savait vraiment qui avait payé sa cotisation, ni combien il restait. L'application remet tout à plat : consommations, dépenses, cotisations mensuelles, solde réel.",
  cardMeta: {
    contexte: "Brigade de gendarmerie",
    role: "Conception + dev",
    usage: "11 membres",
  },
  meta: {
    contexte: "Brigade de gendarmerie, 11 membres",
    role: "Seul — conception, développement, déploiement",
    stack: "React 18 · TypeScript · Vite · TanStack Query · Recharts · Tailwind · shadcn/ui — Node · Express · Prisma · PostgreSQL — JWT (cookie HttpOnly) · Multer — PWA — Docker",
    statut: "En service, 11 membres",
  },
  figures: [
    { value: "11", label: "membres actifs" },
    { value: "6", label: "types d'opérations au registre" },
    { value: "6 mois", label: "d'historique de trésorerie" },
    { value: "", label: "opérations enregistrées / mois", todo: true },
  ],
  technical: {
    label: "Un registre d'écritures, pas un solde éditable",
    body: "Le solde de la caisse n'est jamais stocké : il se recalcule à chaque affichage depuis l'historique des écritures — six types d'opérations, de la cotisation à la correction d'ardoise. La caisse commune et les ardoises personnelles sont deux totaux distincts, et les écritures liées (valider une cotisation, approuver un remboursement) partent en transaction atomique. Rien ne « dérive », tout reste traçable et réversible.",
  },
  blocks: {
    demande:
      "Deux décisions ont structuré le reste. D'abord tenir un historique d'opérations plutôt qu'un solde modifiable : le solde se recalcule, il ne se corrige pas à la main. Ensuite séparer nettement la caisse commune des dépenses personnelles, pour que chacun voie sa propre ardoise sans accès aux comptes des autres.",
    change:
      "Le carnet a disparu. Les relances de cotisation se font depuis l'écran d'administration, et la trésorerie est lisible d'un coup d'œil sur six mois. Un paiement saisi par un membre s'affiche en direct chez les autres.",
  },
  screenshots: {
    card: {
      src: "/screenshots/la-popote-dashboard.jpg",
      alt: "Tableau de bord de La Popote : solde de la caisse commune, nombre de membres, cotisations du mois et courbe d'évolution de la trésorerie.",
      caption: "Tableau de bord — trésorerie et cotisations",
    },
    demande: {
      src: "/screenshots/la-popote-operations.png",
      alt: "Liste des dernières opérations de la caisse : consommations et dépenses, membre et date.",
      caption: "Historique des opérations",
    },
    change: {
      src: "/screenshots/la-popote-admin.jpg",
      alt: "Écran d'administration : suivi des cotisations du mois par membre, ardoises et relances.",
      caption: "Administration — cotisations et relances",
    },
  },
  repoUrl: "https://github.com/QuentinCaffray/la-popote-fund",
  next: "the-crew",
};

const theCrew: Project = {
  slug: "the-crew",
  order: "02",
  name: "The Crew",
  statusLabel: "Boutique Orange",
  statusAccent: false,
  cardColor: "sage",
  initialRotation: 0.5,
  summary:
    "Le quotidien d'une boutique : tâches du jour, objectifs par vendeur, notes et suivi des ventes au même endroit.",
  intro:
    "Dans une boutique Orange, les tâches se distribuaient à l'oral et le pointage des ventes se faisait sur papier, sans vue d'équipe. The Crew réunit en un seul outil mobile les tâches de boutique, le pointage quotidien des ventes par vendeur et le suivi des objectifs du mois, plus un espace d'encadrement réservé à la direction.",
  cardMeta: {
    contexte: "Boutique Orange",
    role: "Conception + dev",
    usage: "~10 vendeurs",
  },
  meta: {
    contexte: "Boutique Orange, ~10 vendeurs + encadrement",
    role: "Seul — conception, développement, déploiement",
    stack: "React 19 · TypeScript · Vite · TanStack Query · Tailwind v4 — Express 5 · Prisma · PostgreSQL — SSE (EventBus maison) — Argon2 · JWT rotatif — PWA — Railway",
    statut: "En service, ~10 vendeurs",
  },
  figures: [
    { value: "~10", label: "vendeurs" },
    { value: "7", label: "indicateurs de vente suivis" },
    { value: "temps réel", label: "sur chaque pointage et chaque tâche" },
  ],
  technical: {
    label: "Temps réel maison, et des chiffres non contestables",
    body: "Toutes les mutations passent par un EventBus en mémoire qui alimente un flux Server-Sent Events : prendre une tâche met à jour le cache des autres clients sans rechargement, pointer une vente déclenche un refetch ciblé. Le client se reconnecte seul, un heartbeat garde la connexion ouverte derrière Railway. Côté intégrité : historique des tâches faites figé, pointage limité à trente jours, et un 409 pour le deuxième vendeur qui prend la même tâche.",
  },
  blocks: {
    demande:
      "Le point sensible, c'était la confiance dans les chiffres. Chaque vendeur pointe lui-même ses ventes, donc la triche devait être structurellement impossible : l'historique des tâches faites est figé, le pointage est limité à trente jours en arrière, la vue calendrier est en lecture seule. Et pour rester utilisable entre deux clients, l'équipe devait voir les mises à jour arriver toutes seules.",
    change:
      "Les tâches ne se distribuent plus à l'oral, le classement du mois est visible et motivant, et la direction a un espace de suivi individuel — notes partagées avec le vendeur d'un côté, notes privées jamais exposées à l'API vendeur de l'autre.",
  },
  screenshots: {
    card: {
      src: "/screenshots/the-crew-dashboard.jpg",
      alt: "Tableau de bord de The Crew : classement du mois par indicateur de vente, avec barres proportionnelles à la couleur de chaque vendeur.",
      caption: "Tableau de bord — classement du mois",
      focus: "left 30%",
    },
    demande: {
      src: "/screenshots/the-crew-objectifs.jpg",
      alt: "Écran des objectifs du mois : barre de progression par indicateur vers la cible, avec statut « validé » quand la cible est atteinte.",
      caption: "Objectifs du mois — progression",
    },
    change: {
      src: "/screenshots/the-crew-kanban.jpg",
      alt: "Liste des tâches de boutique : à faire, en cours, fait, avec bouton « prendre ».",
      caption: "Tâches de boutique",
    },
  },
  repoUrl: "https://github.com/QuentinCaffray/VDB-Orange",
  next: "dpe-simplifie",
};

const dpeSimplifie: Project = {
  slug: "dpe-simplifie",
  order: "03",
  name: "DPE simplifié",
  statusLabel: "Diagnostic immobilier",
  statusAccent: false,
  cardColor: "slate",
  initialRotation: -0.3,
  summary:
    "On dépose le PDF sorti du logiciel métier, l'IA le retravaille, et il ressort un rapport clair qu'un propriétaire lit sans traduction.",
  intro:
    "Un rapport de diagnostic de performance énergétique, c'est trente à quarante pages de jargon réglementaire qu'un propriétaire ne lit jamais. DPE simplifié prend le PDF sorti du logiciel métier, en extrait le texte, le fait réécrire en français clair par un modèle de langage, puis regénère un PDF stylisé prêt à envoyer au client.",
  cardMeta: {
    contexte: "Diagnostiqueur indépendant",
    role: "Conception + dev",
    usage: "Glisser un PDF, en récupérer un",
  },
  meta: {
    contexte: "Diagnostiqueur immobilier indépendant",
    role: "Seul — conception, développement, déploiement",
    stack: "React 18 · TypeScript · Vite · Tailwind · shadcn/ui — Express · pdfjs-dist + pdf-parse · API Mistral · Puppeteer — Railway",
    statut: "En service",
  },
  figures: [
    { value: "3 passes", label: "extraction · vulgarisation · génération" },
    { value: "2", label: "moteurs d'extraction en cascade" },
    { value: "PDF → PDF", label: "aucune ressaisie" },
    { value: "", label: "rapports traités", todo: true },
  ],
  technical: {
    label: "Trois passes, et pas de boîte noire",
    body: "Extraction : pdfjs lit le texte avec ses coordonnées pour reconstituer colonnes et tableaux, pdf-parse en filet de sécurité. Vulgarisation : au-delà de 40 ko le document est découpé, chaque morceau résumé, puis réécrit par l'API Mistral avec un prompt qui interdit de toucher aux valeurs réglementaires — cinq tentatives à backoff exponentiel pour encaisser les limites de débit. Génération : le markdown devient du HTML sans librairie, les graphiques sont des SVG produits à la volée, et Puppeteer sort un PDF A4 mis en page.",
  },
  blocks: {
    demande:
      "L'enjeu, c'était la fidélité : vulgariser sans trahir une étiquette énergie, un taux d'émissions, une recommandation de travaux. Les documents longs sont résumés par morceaux avant réécriture pour ne rien perdre, et le prompt de vulgarisation est contraint sur les valeurs réglementaires. Le rendu final est traité comme un vrai document — mise en page A4, sommaire, graphiques — pas comme une page web imprimée.",
    change:
      "Le diagnostiqueur dépose son PDF et récupère un rapport que son client lit sans traduction. Moins d'allers-retours au téléphone pour réexpliquer un diagnostic.",
  },
  screenshots: {
    card: {
      src: "/screenshots/dpe-upload.png",
      alt: "DPE simplifié : un PDF de diagnostic vient d'être déposé, prêt à être traité.",
      caption: "Dépôt du diagnostic",
    },
    demande: {
      src: "/screenshots/dpe-app.png",
      alt: "Écran d'accueil de DPE simplifié : zone de dépôt du PDF et les trois étapes du pipeline.",
      caption: "Extraction, vulgarisation, génération",
    },
    change: {
      src: "",
      alt: "Rapport de DPE vulgarisé généré en PDF.",
      caption: "Rapport vulgarisé généré",
      placeholder: true,
    },
  },
  repoUrl: "https://github.com/QuentinCaffray/DPE_simplifier",
  next: "la-popote",
};

export const projects: Project[] = [laPopote, theCrew, dpeSimplifie];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
