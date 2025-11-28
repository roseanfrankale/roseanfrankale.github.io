tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        accent: 'var(--accent)',
        'accent-light': 'var(--accent-light)',
        'section-bg': 'var(--section-bg)',
        'card-bg': 'var(--card-bg)',
        'footer-bg': 'var(--footer-bg)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Raleway', 'serif'],
      }
    }
  }
}