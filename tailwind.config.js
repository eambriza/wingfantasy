/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        rb: {
          navy: "#0B1420",
          navy2: "#0E1926",
          panel: "#121D2B",
          panel2: "#172233",
          line: "#223148",
          text: "#E6EDF6",
          subtext: "#818283ff",
          muted: "#818283ff",
          red: "#E10600",
          red2: "#B80C09",
          pill: "#26364D",
          card: "#0F1A28",
          white: "#FFFFFF"
        }
      },
   
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.4)",
        soft: "0 2px 8px rgba(0,0,0,0.25)",
        glass: "0 -12px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
        'glass-lg': "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)"
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui"],
        ui: ["Inter", "ui-sans-serif", "system-ui"]
      }
    },
  },
  plugins: [],
}