import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./styles/**/*.css"
  ],
  theme: {
    extend: {
      colors: {
        border: "rgba(201, 169, 110, 0.15)",
        ink: {
          DEFAULT: "#0A0805",
          2: "#12100C",
          3: "#1C1914"
        },
        gold: {
          DEFAULT: "#C9A96E",
          light: "#E8C98A",
          dim: "#7A6040"
        },
        cream: {
          DEFAULT: "#F5EFE4",
          muted: "#9A8F80"
        },
        success: "#2ECC71",
        danger: "#E74C3C"
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        body: ['"Jost"', "sans-serif"]
      },
      boxShadow: {
        gold: "0 20px 80px rgba(201, 169, 110, 0.18)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.05)"
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top, rgba(201, 169, 110, 0.18), transparent 42%), radial-gradient(circle at 85% 18%, rgba(232, 201, 138, 0.1), transparent 28%), linear-gradient(180deg, rgba(10,8,5,0.84), rgba(10,8,5,1))",
        "olive-mesh":
          "linear-gradient(90deg, rgba(201,169,110,0.06) 1px, transparent 1px), linear-gradient(rgba(201,169,110,0.06) 1px, transparent 1px), linear-gradient(135deg, rgba(122,96,64,0.9), rgba(10,8,5,1))"
      },
      keyframes: {
        grain: {
          "0%, 100%": { transform: "translate(0,0)" },
          "10%": { transform: "translate(-2%, -3%)" },
          "30%": { transform: "translate(3%, -1%)" },
          "50%": { transform: "translate(-1%, 4%)" },
          "70%": { transform: "translate(2%, 1%)" },
          "90%": { transform: "translate(-3%, 2%)" }
        },
        "scroll-pulse": {
          "0%, 100%": { opacity: "0.4", transform: "scaleY(1)" },
          "50%": { opacity: "1", transform: "scaleY(1.3)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        ripple: {
          "0%": { transform: "translate(-50%, -50%) scale(0.2)", opacity: "0.8" },
          "100%": { transform: "translate(-50%, -50%) scale(5)", opacity: "0" }
        }
      },
      animation: {
        grain: "grain 8s steps(10) infinite",
        "scroll-pulse": "scroll-pulse 1.8s ease infinite",
        shimmer: "shimmer 2.2s linear infinite",
        ripple: "ripple 700ms ease-out forwards"
      }
    }
  },
  plugins: [
    forms({
      strategy: "class"
    }),
    plugin(({ addUtilities }) => {
      addUtilities({
        ".clip-diagonal": {
          clipPath: "polygon(0 0, 100% 0, 100% 88%, 0 100%)"
        },
        ".clip-diagonal-r": {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 88%)"
        },
        ".clip-parallelogram": {
          clipPath: "polygon(14% 0, 100% 0, 86% 100%, 0 100%)"
        }
      });
    })
  ]
};

export default config;
