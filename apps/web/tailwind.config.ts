import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        daka: {
          DEFAULT: "#0e7490",
          dark: "#155e75",
          light: "#e0f2fe",
        },
      },
    },
  },
  plugins: [],
};

export default config;
