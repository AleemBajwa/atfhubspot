/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600
          light: '#3b82f6', // blue-500
          dark: '#1e40af', // blue-800
        },
        accent: '#f59e42', // orange from Atf_landing
        background: '#f8fafc', // soft gray
        card: '#ffffff',
        border: '#e5e7eb',
      },
      boxShadow: {
        card: '0 4px 24px 0 rgba(0,0,0,0.04)',
        button: '0 2px 8px 0 rgba(37,99,235,0.10)',
      },
      borderRadius: {
        xl: '1.25rem',
        card: '1.5rem',
        button: '9999px',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)',
      },
    },
  },
  plugins: [],
} 