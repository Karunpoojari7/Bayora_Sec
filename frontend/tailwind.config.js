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
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          card: '#FFFFFF',
          cardHover: '#F1F5F9',
          border: '#E2E8F0',
          borderHighlight: '#CBD5E1',
          accent: '#2563EB',
          accentHover: '#1D4ED8',
          accentLight: '#EFF6FF',
          cyan: '#0284C7',
          cyanLight: '#E0F2FE',
          emerald: '#059669',
          emeraldLight: '#ECFDF5',
          danger: '#DC2626',
          dangerLight: '#FEF2F2',
          warning: '#D97706',
          warningLight: '#FFFBEB',
          textPrimary: '#0F172A',
          textSecondary: '#475569',
          textMuted: '#64748B',
          textBright: '#0F172A',
          navy: '#0B1528'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace']
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
