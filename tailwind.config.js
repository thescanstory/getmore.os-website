/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        brand: {
          black: '#050507',
          dark: '#0A0A0E',
          surface: '#0F1016',
          card: '#13141C',
          cardBorder: 'rgba(255, 255, 255, 0.08)',
          accent: '#10B981',
          accentLight: '#34D399',
          indigoGlow: '#6366F1',
          blueGlow: '#3B82F6'
        }
      }
    }
  },
  plugins: [],
}
