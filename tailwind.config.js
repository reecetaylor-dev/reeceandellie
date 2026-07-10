/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'Cambria', 'serif'],
        sans: ['Montserrat', 'ui-sans-serif', 'sans-serif'],
      },
      colors: {
        ivory: '#FAF8F4',
        cream: '#F3EFE6',
        gold: {
          DEFAULT: '#C9A96E',
          light: '#E8D5A3',
          dark: '#A07840',
        },
        sage: '#7A8C6E',
        blush: '#E8C4B8',
        charcoal: '#2C2C2C',
        stone: '#5C5248',
      },
      letterSpacing: {
        widest2: '0.4em',
        widest3: '0.3em',
        widest4: '0.25em',
        widest5: '0.2em',
      },
    },
  },
  plugins: [],
};
