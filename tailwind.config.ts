import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f2e8d6",
        ink: "#180d08",
        muted: "#7b6554",
        line: "#24140d",
        accent: "#df352b",
        cream: "#fff6e7"
      },
      boxShadow: {
        hard: "7px 8px 0 #180d08",
        soft: "0 18px 45px rgba(24, 13, 8, 0.16)"
      },
      fontFamily: {
        display: ["Arial Black", "Arial", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Consolas", "monospace"]
      }
    }
  },
  plugins: []
} satisfies Config;
