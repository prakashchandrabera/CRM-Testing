import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      colors: {
        ink: "#4a4a4a",
        panel: "#555555",
        canvas: "#f4f4f5",
      },
      borderRadius: { card: "36px" },
      boxShadow: {
        card: "0 18px 40px -12px rgba(0,0,0,0.18)",
        pill: "0 6px 14px -4px rgba(0,0,0,0.18)",
      },
    },
  },
  plugins: [],
};
export default config;
