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
        // Midnight Blue exact palette
        midnight: {
          app: '#030914',
          main: '#050D1A',
          sidebar: '#061120',
          header: '#040B16',
          card: '#071729',
          cardSecondary: '#0A1D31',
          elevated: '#0D243B',
          input: '#061321',
          tableHeader: '#0C2137',
          hover: '#0B2C4C',
          activeBg: '#0753A6',
        },
        borderMb: {
          standard: '#12324F',
          primary: '#075AA0',
          electric: '#087BDA',
          glow: '#008CFF',
          divider: '#10283E',
          active: '#00A3FF',
        },
        textMb: {
          primary: '#EAF4FF',
          secondary: '#A9C2DA',
          muted: '#718BA6',
          technical: '#7FB6E8',
          headings: '#F4F8FF',
        },
        semanticMb: {
          action: '#087BFF',
          hover: '#2395FF',
          verified: '#00D6B5',
          healthy: '#19CDA5',
          warning: '#FFB547',
          threat: '#FF3D59',
          violet: '#A56BFF',
          disabled: '#52657A',
        },
        bayora: {
          bg: '#030914',
          surface: '#071729',
          card: '#071729',
          cardHover: '#0B2C4C',
          border: '#12324F',
          borderHighlight: '#087BDA',
          accent: '#087BFF',
          accentHover: '#2395FF',
          accentLight: '#0A1D31',
          cyan: '#00D6B5',
          cyanLight: '#081E20',
          emerald: '#19CDA5',
          emeraldLight: '#0A2926',
          danger: '#FF3D59',
          dangerLight: '#1F0A10',
          warning: '#FFB547',
          warningLight: '#241705',
          textPrimary: '#EAF4FF',
          textSecondary: '#A9C2DA',
          textMuted: '#718BA6',
          textBright: '#F4F8FF',
          navy: '#061120'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace']
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.4)',
        'card': '0 4px 12px 0 rgba(0, 0, 0, 0.5)',
        'elevated': '0 10px 25px -3px rgba(0, 0, 0, 0.6)',
        'electric': '0 0 12px rgba(8, 123, 218, 0.45)',
        'active-nav': '0 0 16px rgba(0, 163, 255, 0.35)',
        'cyan-glow': '0 0 12px rgba(0, 214, 181, 0.45)',
        'red-glow': '0 0 12px rgba(255, 61, 89, 0.45)',
        'violet-glow': '0 0 12px rgba(165, 107, 255, 0.45)',
      }
    },
  },
  plugins: [],
}
