import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0A0E1A',
          900: '#111827',
          800: '#1A2235',
          700: '#222D42',
        },
        teal: {
          700: '#0F6E56',
          500: '#1D9E75',
          400: '#5DCAA5',
          300: '#9FE1CB',
        },
        semantic: {
          info:    '#378ADD',
          success: '#1D9E75',
          danger:  '#E24B4A',
          warning: '#EF9F27',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
