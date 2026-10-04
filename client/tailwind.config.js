/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F5F2EC',
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#1A1916',
          muted: '#635F56',
          subtle: '#8C877D',
        },
        line: {
          DEFAULT: '#E3DED4',
          dark: '#CBC4B5',
        },
        brand: {
          DEFAULT: '#1F4D3A',
          hover: '#173B2C',
          light: '#EAF2ED',
        },
        urgent: {
          DEFAULT: '#C2412D',
          light: '#FBECE9',
        },
        pending: {
          DEFAULT: '#B7791F',
          light: '#FBF4E7',
        },
        resolved: {
          DEFAULT: '#3E7B4F',
          light: '#EAF3ED',
        },
        radar: {
          dark: '#0F1612',
          surface: '#15211B',
          line: '#1E3027',
          grid: '#23372D',
          emerald: '#10B981',
          accent: '#34D399',
        }
      },
      fontFamily: {
        sans: ['Instrument Sans', 'Geist', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'Cambria', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        'control': '6px',
        'card': '10px',
      },
      boxShadow: {
        'clean': '0 1px 3px rgba(26,25,22,0.06)',
        'elevated': '0 4px 14px rgba(26,25,22,0.08)',
        'modal': '0 12px 32px rgba(26,25,22,0.14)',
      }
    },
  },
  plugins: [],
}
