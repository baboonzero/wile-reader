/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme
        'bg-primary': '#0A0E27',
        'bg-secondary': '#131729',
        'bg-gradient-start': '#1A1F3A',
        'bg-gradient-end': '#0D1127',
        'text-primary': '#FFFFFF',
        'text-secondary': '#94A3B8',
        'text-muted': '#64748B',
        'accent-primary': '#8B5CF6',
        'accent-secondary': '#3B82F6',
        'orp-highlight': '#FF3B30',
        'success': '#10B981',
        'warning': '#F59E0B',
      },
      fontFamily: {
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        reading: ['SF Pro Display', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'reading-mobile': '48px',
        'reading-mobile-lg': '56px',
        'reading-tablet': '64px',
        'reading-desktop': '72px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'gradient-accent': 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
      },
      backdropBlur: {
        glass: '12px',
      },
      boxShadow: {
        'glow-purple': '0 4px 16px rgba(139, 92, 246, 0.4)',
        'glow-red': '0 0 20px rgba(255, 59, 48, 0.4)',
      },
      animation: {
        'fade-in-word': 'fadeInWord 120ms ease-out',
        'slide-up': 'slideUp 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeInWord: {
          'from': { opacity: '0', transform: 'scale(0.95)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          'from': { transform: 'translateY(100%)' },
          'to': { transform: 'translateY(0)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}
