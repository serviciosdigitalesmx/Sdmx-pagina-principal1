import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px var(--tenant-primary-glow)" },
          "50%": { boxShadow: "0 0 40px var(--tenant-primary-glow), 0 0 60px var(--tenant-primary-glow)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        countUp: {
          "0%": { opacity: "0", transform: "scale(0.5)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        float: "float 5.5s ease-in-out infinite",
        gradientShift: "gradientShift 8s ease infinite",
        pulseGlow: "pulseGlow 2s infinite",
        fadeInUp: "fadeInUp 0.8s ease-out forwards",
        countUp: "countUp 0.5s ease-out forwards",
        slideIn: "slideIn 1.5s ease-out forwards",
      },
    },
  },
};

export default config;
