import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
        },
        sidebar: {
          bg:     '#ffffff',
          hover:  '#faf5ff',
          active: '#f3e8ff',
          text:   '#6b7280',
          border: '#e5e7eb',
        },
      },
    },
  },
  plugins: [],
}

export default config