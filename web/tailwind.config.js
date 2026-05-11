/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Tokens do design system (cores extraídas do estilo brev.ly / Figma)
        blue: {
          base: '#2C46B1',
          dark: '#2C4091',
        },
        gray: {
          100: '#F9F9FB',
          200: '#E4E6EC',
          300: '#CDCFD5',
          400: '#74798B',
          500: '#4D505C',
          600: '#1F2025',
        },
        danger: '#B12C4D',
      },
      fontFamily: {
        sans: ['Open Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Escala de tipografia mapeada à do Figma
        xl: ['24px', { lineHeight: '30px', fontWeight: '700' }],
        lg: ['18px', { lineHeight: '24px', fontWeight: '600' }],
        md: ['14px', { lineHeight: '18px', fontWeight: '600' }],
        sm: ['12px', { lineHeight: '16px', fontWeight: '600' }],
        'body-md': ['14px', { lineHeight: '18px', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'body-xs': ['10px', { lineHeight: '14px', fontWeight: '600' }],
      },
      boxShadow: {
        card: '0 4px 6px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        spin: 'spin 1s linear infinite',
        'fade-in': 'fadeIn 200ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
