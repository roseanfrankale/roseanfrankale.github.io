/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./assets/js/**/*.js",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Define colors based on your CSS variables for easier use
        'bg': 'var(--bg)',
        'text': 'var(--text)',
        'accent': 'var(--accent)',
        'accent-light': 'var(--accent-light)',
        'text-muted': 'var(--text-muted)',
        'footer-bg': 'var(--footer-bg)',
        'section-bg': 'var(--section-bg)',
        'card-bg': 'var(--card-bg)',
      },
      fontFamily: {
        // Match your Google Fonts
        sans: ['Inter', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        }
      }
    },
  },
  plugins: [],
}

