/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        mono: ["'DM Mono'", "monospace"],
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
      },
      colors: {
        // cream → now dark text on white
        cream: {
          50:  "#1a1a1a",
          100: "#111111",
          200: "#333333",
          300: "#555555",
        },
        // ink → now white/light surfaces
        ink: {
          900: "#ffffff",
          800: "#f5f5f3",
          700: "#ebebea",
          600: "#d8d8d5",
          500: "#b0b0aa",
        },
        electric: {
          400: "#2563eb",
          500: "#1d4ed8",
          600: "#1e40af",
        },
        gold: {
          400: "#d97706",
          500: "#b45309",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        blink: "blink 1s step-end infinite",
        grain: "grain 8s steps(10) infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: 0 },
          "100%": { opacity: 1 },
        },
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%":      { opacity: 0 },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%":  { transform: "translate(-5%, -10%)" },
          "20%":  { transform: "translate(-15%, 5%)" },
          "30%":  { transform: "translate(7%, -25%)" },
          "40%":  { transform: "translate(-5%, 25%)" },
          "50%":  { transform: "translate(-15%, 10%)" },
          "60%":  { transform: "translate(15%, 0%)" },
          "70%":  { transform: "translate(0%, 15%)" },
          "80%":  { transform: "translate(3%, 35%)" },
          "90%":  { transform: "translate(-10%, 10%)" },
        },
      },
    },
  },
  plugins: [],
};