/**
 * Contenu de niveau site : accroche, méthode, à-propos, stack, contact.
 * Copy reprise du handoff (design_handoff_portfolio/README.md §Contenu).
 */

export const site = {
  name: "Quentin Caffray",
  role: "Développeur full stack",
  heroKicker: "Développeur full stack · JavaScript / React",
  heroKickerShort: "Dév. full stack · JS / React",
  heroTitle: ["Je construis des outils", "que des gens utilisent", "tous les jours."],
  heroTitleFlat: "Je construis des outils que des gens utilisent tous les jours.",
  intro:
    "Trois applications en service : une caisse commune de brigade, un pilotage de boutique, un rapport de diagnostic énergétique enfin lisible. Conçues vite, avec l'IA dans la boucle, puis mises à l'épreuve du terrain.",
  editorialNote:
    "Aucune de ces applications n'était un exercice. Les trois tournent chez de vrais utilisateurs.",
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
      body: "Je regarde comment les gens font aujourd'hui, carnet et tableur compris, avant d'écrire une ligne.",
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
    "Je pars d'un besoin réel, je livre une première version en quelques jours, puis je la corrige avec ceux qui s'en servent. L'IA me sert d'accélérateur sur le code et l'exploration : elle raccourcit les allers-retours, elle ne décide pas de l'architecture.",
  stack: [
    { name: "React · TypeScript", level: "quotidien" },
    { name: "Node · API REST", level: "quotidien" },
    { name: "PostgreSQL · Prisma", level: "à l'aise" },
    { name: "Docker · déploiement", level: "à l'aise" },
    { name: "Outils IA", level: "dans la boucle" },
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
