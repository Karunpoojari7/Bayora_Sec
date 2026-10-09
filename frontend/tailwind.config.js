/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bayora: {
          bg: '#080C14',
          card: '#0D1424',
          cardHover: '#131D33',
          border: '#1E293B',
          borderHighlight: '#334155',
          accent: '#2563EB',
          cyan: '#06B6D4',
          emerald: '#10B981',
          danger: '#EF4444',
          warning: '#F59E0B',
          textMuted: '#94A3B8',
          textBright: '#F8FAFC'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
