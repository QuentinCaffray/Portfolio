/**
 * Contenu de niveau site : accroche, méthode, à-propos, stack, contact.
 * Copy reprise du handoff (design_handoff_portfolio/README.md §Contenu).
 */

export const site = {
  name: "Quentin Caffray",
  role: "Développeur full stack",
  heroKicker: "Développeur full stack · JavaScript / React",
  heroKickerShort: "Dév. full stack · JS / React",
  heroTitle: ["Des applications métier,", "livrées en production,", "en usage réel."],
  heroTitleFlat: "Des applications métier, livrées en production, en usage réel.",
  intro:
    "Trois applications en service : une caisse commune de brigade, un pilotage de boutique, un rapport de diagnostic énergétique enfin lisible. Livrées rapidement, l'IA en accélérateur, affinées ensuite au contact des utilisateurs.",
  editorialNote:
    "Les trois applications sont déployées et utilisées au quotidien.",
  availability: "Ouvert aux opportunités CDI",
  heroFigures: [
    { value: "3", label: "apps en service" },
    { value: "3", label: "secteurs — gendarmerie, retail, diagnostic" },
    { value: "1", label: "personne, de l'idée au déploiement" },
  ],
  method: [
    {
      step: "01 — Cadrer",
      title: "Le besoin, sur place",
      body: "J'observe les méthodes de travail en place, tableurs et outils détournés compris, avant d'écrire la moindre ligne de code.",
    },
    {
      step: "02 — Livrer vite",
      title: "Une version utilisable en jours",
      body: "L'IA accélère le code et l'exploration. Le périmètre et l'architecture restent des décisions prises à la main.",
    },
    {
      step: "03 — Corriger",
      title: "Avec ceux qui s'en servent",
      body: "Chaque app a changé après les premières semaines d'usage réel. C'est là que le produit se décide.",
    },
  ],
  about:
    "Chaque projet part d'un besoin réel, cadré avec ses futurs utilisateurs. Je livre une première version exploitable, puis je l'affine avec eux jusqu'à ce qu'elle s'installe dans leur travail. L'IA me sert d'accélérateur sur le code et l'exploration ; le périmètre et l'architecture restent mes décisions.",
  stack: [
    { name: "React · TypeScript", level: "quotidien" },
    { name: "Node · API REST", level: "quotidien" },
    { name: "PostgreSQL · Prisma", level: "à l'aise" },
    { name: "Docker · déploiement", level: "à l'aise" },
    { name: "Outils IA", level: "quotidien" },
  ],
  contact: {
    phoneDisplay: "06 09 97 52 44",
    phoneHref: "tel:+33609975244",
    github: "https://github.com/QuentinCaffray",
    githubLabel: "github.com/QuentinCaffray",
    location: "Haute-Savoie",
    footerLine: "Disponible pour un CDI · ouvert aux missions freelance · Haute-Savoie",
  },
} as const;
