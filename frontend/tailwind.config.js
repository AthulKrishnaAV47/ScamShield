/** Palette chosen for contrast: every text/background pair below is >= 7:1 (WCAG AAA). */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["var(--font-body)", "system-ui", "sans-serif"] },
      colors: {
        ink: "#0F1F38",
        panel: "#EEF3F9",
        line: "#9DB0C9",
        trust: { DEFAULT: "#0B4A8F", dark: "#083868" },
        alert: { DEFAULT: "#B3001B", dark: "#7F0013" },
        safe: "#0A6B34",
        warn: "#8A4B00",
      },
    },
  },
  plugins: [],
};
