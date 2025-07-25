/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-green': '#00FF41',
        'cyber-dark': '#0a0a0a',
        'cyber-gray': '#1a1a1a',
        'cyber-light': '#2a2a2a',
        'terminal-green': '#33ff33',
        'warning-red': '#ff3333',
      },
      fontFamily: {
        'mono': ['Courier New', 'monospace'],
        'cyber': ['Orbitron', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 5px #00FF41, 0 0 10px #00FF41' },
          '100%': { textShadow: '0 0 10px #00FF41, 0 0 20px #00FF41, 0 0 30px #00FF41' }
        }
      }
    },
  },
  plugins: [],
}