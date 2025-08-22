/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ed',
          100: '#fdedd4',
          200: '#fbd7a9',
          300: '#f8bb72',
          400: '#f5953a',
          500: '#f2751a',
          600: '#e35a0f',
          700: '#bc420f',
          800: '#963513',
          900: '#7a2e14',
        },
        festival: {
          gold: '#FFD700',
          orange: '#FF8C00',
          red: '#DC143C',
          maroon: '#800000',
        }
      },
      fontFamily: {
        // Custom font families as per specification
        'charter': ['Charter', 'serif'], // Body text (serif)
        'kievit': ['Kievit', 'sans-serif'], // Body text (sans-serif)  
        'jaf-bernino': ['JAF Bernino Sans', 'sans-serif'], // Headings and titles
        'sohne': ['Söhne', 'sans-serif'], // Subheadings
        'helvetica': ['Helvetica', 'Arial', 'sans-serif'], // Subheadings
        'circular': ['Circular Std', 'sans-serif'], // Branding and UI
        'style-script': ['Style Script', 'cursive'], // Keep existing for special text
        
        // Default fallbacks
        'sans': ['Circular Std', 'Helvetica', 'Arial', 'sans-serif'],
        'serif': ['Charter', 'Georgia', 'serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #FFD700' },
          '100%': { boxShadow: '0 0 20px #FFD700, 0 0 30px #FFD700' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
