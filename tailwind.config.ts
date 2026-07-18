import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0E1B23",       // deep teal-navy background
        surface: "#152631",   // panel surface
        surface2: "#1D3441",  // raised panel
        paper: "#EDEDE5",     // warm off-white text
        signal: "#F2A93B",    // amber signal accent
        cyan: "#5EEAD4",      // secondary cyan
        muted: "#7C93A0",     // muted slate text
        danger: "#F2664B",
        okgreen: "#6FCF97",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(237,237,229,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(237,237,229,0.035) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      keyframes: {
        ping_slow: {
          "0%": { transform: "scale(1)", opacity: "0.7" },
          "75%, 100%": { transform: "scale(2.4)", opacity: "0" },
        },
        drift: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        ping_slow: "ping_slow 2.4s cubic-bezier(0,0,0.2,1) infinite",
        drift: "drift 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
