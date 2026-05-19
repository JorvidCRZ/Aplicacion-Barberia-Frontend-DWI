module.exports = {
  content: [
    './src/**/*.{html,ts,css}',
    './public/**/*.{html,ts,css}'
  ],
  theme: {
    extend: {
      colors: {
        'brand-gold': 'var(--color-brand-gold)',
        'brand-gold-hover': 'var(--color-brand-gold-hover)'
      }
    }
  },

  plugins: [],
};
