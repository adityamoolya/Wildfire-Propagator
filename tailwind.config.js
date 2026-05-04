/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        floatUp: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.8' },
          '100%': { transform: 'translateY(-150px) scale(3) rotate(20deg)', opacity: '0' },
        },
        flicker: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        }
      },
      animation: {
        'smoke-fast': 'floatUp 2s ease-in infinite',
        'smoke-slow': 'floatUp 4s ease-in infinite',
        'fire-flicker': 'flicker 0.3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}