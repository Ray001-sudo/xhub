/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0B0B0C",
        card: {
          DEFAULT: "#161618",
          hover: "#222225",
        },
        primary: {
          DEFAULT: "#FF9900",
          hover: "#E08600",
        },
        main: "#FFFFFF",
        muted: "#A1A1AA",
        // Backward-compatibility fallbacks
        bg: "#0B0B0C",
        surface: "#161618",
        "surface-2": "#222225",
        line: "#27272A",
        signal: {
          DEFAULT: "#FF9900",
          dim: "#E08600",
        },
        cartridge: {
          DEFAULT: "#FF9900",
          dim: "#E08600",
        },
        ink: {
          DEFAULT: "#FFFFFF",
          muted: "#A1A1AA",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Inter", "sans-serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      aspectRatio: {
        video: "16 / 9",
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
        "card-hover": "0 8px 30px rgba(255, 153, 0, 0.15)",
      },
    },
  },
  plugins: [],
};
