/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F8FAFC',
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#0F172A',
          muted: '#64748B',
          subtle: '#94A3B8',
        },
        line: {
          DEFAULT: '#E2E8F0',
          dark: '#CBD5E1',
        },
        brand: {
          DEFAULT: '#047857',
          hover: '#065F46',
          light: '#ECFDF5',
          dark: '#064E3B',
          accent: '#10B981',
        },
        urgent: {
          DEFAULT: '#E11D48',
          light: '#FFF1F2',
        },
        pending: {
          DEFAULT: '#D97706',
          light: '#FFFBEB',
        },
        resolved: {
          DEFAULT: '#059669',
          light: '#ECFDF5',
        },
        radar: {
          dark: '#0B0F12',
          surface: '#111827',
          line: '#1F2937',
          grid: '#1E293B',
          emerald: '#10B981',
          accent: '#34D399',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        'control': '8px',
        'card': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        'clean': '0 1px 3px rgba(15, 23, 42, 0.05)',
        'elevated': '0 10px 30px -10px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.04)',
        'modal': '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
        'glow-emerald': '0 0 35px -5px rgba(16, 185, 129, 0.35)',
        'glow-brand': '0 0 40px -10px rgba(4, 120, 87, 0.4)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
