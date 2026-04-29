import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#fff7f9",
          100: "#ffe8ef",
          200: "#ffd1dd",
          300: "#f7a8be",
          500: "#d96b8f",
        },
        champagne: {
          100: "#fff8e7",
          300: "#f0d68a",
          500: "#c9a227",
          700: "#8a6f1a",
        },
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "Arial", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 45px rgba(217, 107, 143, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
