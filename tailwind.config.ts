import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  daisyui: {
    themes: [
      {
        mytheme: {          
          "primary": "#000000",
          "secondary": "#282828",
          "accent": "#F37226",
          "neutral": "#ff00ff",          
          "base-100": "#ff00ff",          
          "info": "#0000ff",          
          "success": "#16a34a",          
          "warning": "#f87171",          
          "error": "#991b1b",
          },
        },
      ],
  },
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    require('daisyui')
  ],
};
export default config;
