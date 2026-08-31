import type { Config } from "tailwindcss";

/**
 * Tokens repris du handoff design (design_handoff_portfolio/README.md).
 * Direction « fiches sur tableau », palette claire papier quadrillé.
 */
const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      screens: {
        // Point de rupture du handoff : hero une colonne, fiches empilées
        bp: "900px",
      },
      maxWidth: {
        content: "1180px",
      },
      colors: {
        ink: {
          DEFAULT: "#1c1a17", // texte, boutons, pied de page
          soft: "#2b2823", // texte secondaire
          muted: "#4a463e", // texte tertiaire
        },
        mono: "#514b39", // labels JetBrains Mono — assombri vs handoff (#57523f) pour contraste AA
        paper: {
          DEFAULT: "#fffdf8", // texte sur fond encre / badges
          dim: "#a09a8e", // texte discret sur fond encre
        },
        accent: {
          DEFAULT: "#8a4a2c", // terre cuite
          hover: "#a03a17",
          ondark: "#d98b5f", // terre cuite éclaircie pour contraste AA sur fond encre
        },
        canvas: "#dcd8ce", // fond de page
        board: "#ebe0c7", // fond du « tableau »
        card: {
          sand: "#e8dcb8", // La Popote
          sage: "#cfd8c8", // The Crew
          slate: "#c8d3dd", // DPE simplifié
        },
        editorial: "#e0d5c6", // encart éditorial
        panel: "#e2ddd2", // panneau neutre (stack, blocs texte page projet)
        method: "#e8e4d9", // bandeau méthode / pied de nav
        ok: "#4d8b5f", // point « disponible »
        line: {
          DEFAULT: "rgba(28,26,23,0.16)",
          soft: "rgba(28,26,23,0.1)",
          strong: "rgba(28,26,23,0.3)",
        },
      },
      fontFamily: {
        display: ["'Bricolage Grotesque'", "system-ui", "sans-serif"],
        sans: ["'Instrument Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        mono: "0.1em",
        "mono-wide": "0.14em",
        "mono-wider": "0.16em",
      },
      boxShadow: {
        flat: "5px 5px 0 rgba(28,26,23,0.07)",
        "flat-sm": "4px 4px 0 rgba(28,26,23,0.06)",
        "flat-lg": "6px 6px 0 rgba(28,26,23,0.07)",
        lift: "12px 16px 26px rgba(28,26,23,0.16)",
      },
      backgroundImage: {
        grid: [
          "linear-gradient(rgba(28,26,23,0.11) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(28,26,23,0.11) 1px, transparent 1px)",
          "linear-gradient(rgba(28,26,23,0.045) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(28,26,23,0.045) 1px, transparent 1px)",
        ].join(", "),
      },
      backgroundSize: {
        grid: "130px 130px, 130px 130px, 26px 26px, 26px 26px",
        "grid-mobile": "120px 120px, 120px 120px, 24px 24px, 24px 24px",
      },
      transitionTimingFunction: {
        drop: "cubic-bezier(0.2, 1.1, 0.35, 1)",
        reset: "cubic-bezier(0.2, 1.2, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
