import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cloud: "#F7F8FB",
        ink: "#322D45",
        "mint-stamp": "#9FE0C7",
        "peach-reward": "#FFC9A3",
        "lavender-card": "#E4DFF5",
        "muted-gray": "#B9B4C9",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        display: ["Sora", ...defaultTheme.fontFamily.sans],
        mono: ["Space Mono", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
};

export default config;
