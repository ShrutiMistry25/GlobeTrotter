export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FFF8F4',
        surface: '#FFFFFF',
        'surface-dim': '#F9F0E9',
        'surface-container': '#F3E9E0',
        primary: { DEFAULT: '#8C4A2E', container: '#F3DFD2', dark: '#6E3820' },
        secondary: '#546347',
        'secondary-container': '#E3E8DA',
        tertiary: '#006763',
        error: '#B3261E',
        ink: '#221B16',
        muted: '#8A8078',
        outline: '#DAD0C7'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        ambient: '0 24px 48px -16px rgba(138,128,120,0.22)',
        soft: '0 8px 24px -10px rgba(138,128,120,0.25)',
        lift: '0 16px 40px -12px rgba(140,74,46,0.28)'
      },
      borderRadius: { '2xl': '1.25rem', '3xl': '1.75rem' },
      spacing: { 18: '4.5rem', 30: '7.5rem' }
    }
  },
  plugins: []
};
