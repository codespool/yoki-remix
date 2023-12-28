import type { Config } from 'tailwindcss'

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      xl: "1440px"
    },
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"]
      },
      backgroundImage: {
        "astar-gradient": "linear-gradient(to top right, rgba(230, 0, 122, 0.4), rgba(112, 58, 194, 0.2) 10%, rgba(0, 84, 182, 0.5) 35%, rgba(0, 112, 235, 0.5) 80%, rgba(10, 226, 255, 0.3))",
      },
    },
  },
  plugins: [],
} satisfies Config

