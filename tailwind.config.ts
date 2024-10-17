import type { Config } from "tailwindcss";

const config: Config = {
  mode: 'jit',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'lightest-blue': '#f2f7fb',
        'lighter-blue': '#e7f0f8',
        'light-blue': '#d3e2f2',
        'muted-blue': '#b9cfe8',
        'medium-blue': '#9cb6dd',
        'primary-blue': '#839dd1',
        'dark-blue': '#6a7fc1',
        'darker-blue': '#6374ae',
        'deep-blue': '#4a5989',
        'midnight-blue': '#414e6e',
        'black-blue': '#262c40',
      },
    },
  },
  plugins: [],
};
export default config;
