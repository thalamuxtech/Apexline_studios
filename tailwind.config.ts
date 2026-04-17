import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1.5rem", screens: { "2xl": "1440px" } },
    extend: {
      colors: {
        onyx: "#0B0B0C",
        graphite: "#14161A",
        line: "#2A2D33",
        bone: "#F4F1EC",
        ivory: "#EAE6DE",
        stone: "#6B6E74",
        gold: { DEFAULT: "#C9A24B", soft: "#E5C98A", deep: "#9E7E33" },
        success: "#2E7D5B",
        danger: "#B23A48",
      },
      fontFamily: {
        display: ["var(--font-display)", "Playfair Display", "serif"],
        editorial: ["var(--font-editorial)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3.5rem, 8vw, 8.5rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "display-l": ["clamp(2.5rem, 5vw, 5rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
      },
      letterSpacing: { tightest: "-0.03em", eyebrow: "0.18em" },
      transitionTimingFunction: { apex: "cubic-bezier(0.22, 1, 0.36, 1)" },
      keyframes: {
        "marquee": { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        "draw-line": { "0%": { transform: "scaleX(0)" }, "100%": { transform: "scaleX(1)" } },
        "fade-up": { "0%": { opacity: "0", transform: "translateY(24px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "ken-burns": { "0%": { transform: "scale(1)" }, "100%": { transform: "scale(1.08)" } },
      },
      animation: {
        marquee: "marquee 45s linear infinite",
        "draw-line": "draw-line 1s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-up": "fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "ken-burns": "ken-burns 24s ease-out infinite alternate",
      },
    },
  },
  plugins: [],
};

export default config;
