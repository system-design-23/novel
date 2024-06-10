/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      aspectRatio: {
        card: '215/322',
        'code-view': '2/1'
      },
      fontFamily: {
        'read-sans': ['Inter'],
        'read-serif': ['Merriweather']
      },
      colors: {
        primary: '#16314A',
        secondary: '#EEF4F5'
      }
    }
  },
  plugins: []
};
