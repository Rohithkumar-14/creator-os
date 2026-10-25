/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-bg)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          elevated: 'var(--color-surface-elevated)',
          muted: 'var(--color-surface-muted)',
          hover: 'var(--color-surface-hover)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          focus: 'var(--color-border-focus)',
        },
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        accent: {
          DEFAULT: '#8B5CF6',
          hover: '#A78BFA',
          active: '#6D28D9',
          light: '#EDE9FE',
          subtle: 'rgba(139, 92, 246, 0.12)',
        },
        yt: {
          DEFAULT: '#FF0000',
          subtle: 'rgba(255, 0, 0, 0.12)',
        },
        ig: {
          DEFAULT: '#E1306C',
          subtle: 'rgba(225, 48, 108, 0.12)',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        }
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.25), 0 1px 2px -1px rgba(0, 0, 0, 0.25)',
        'card': '0 4px 14px 0 rgba(0, 0, 0, 0.35)',
        'elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.45)',
        'glow': '0 0 20px -3px rgba(139, 92, 246, 0.25)',
      }
    },
  },
  plugins: [],
}
