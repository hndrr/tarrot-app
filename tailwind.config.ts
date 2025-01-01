import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    animation: {
      fade: "fade 2.5s infinite",
      spin: "spin 1s linear infinite",
    },
    keyframes: {
      fade: {
        "0%": { opacity: "0" },
        "50%": { opacity: "1" },
        "100%": { opacity: "0" },
      },
      spin: {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(360deg)" },
      },
    },
  },
  plugins: [],
} satisfies Config;
