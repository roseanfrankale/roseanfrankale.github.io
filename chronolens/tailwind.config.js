/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./{components,services,types,constants}.ts",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        void: '#000000', // Previously var(--bg-base)
        chrono: {
          900: '#050b14',        // Previously var(--bg-panel)
          800: '#10161f',        // Approximated from color-mix
          500: '#00f0ff',        // Previously var(--color-primary)
          400: '#7000ff',        // Previously var(--color-secondary)
          100: '#ccf9ff',        // Approximated from color-mix
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'void': 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000000 100%)', // Approximated from color-mix
      }
    },
  },
  plugins: [],
}