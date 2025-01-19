/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all React component files
  ],
  theme: {
    extend: {
      animation: {
        "bounce-in": "bounce-in 0.4s ease-out",
      },
      keyframes: {
        "bounce-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(-20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      colors: {
        pink: "#f06292", // Main pink color
        "pink-light": "#f89cb5", // Lighter pink
        "pink-dark": "#e0436b", // Darker pink
        offwhite: "#f9f9f9", // Off-white for background
      },
    },
  },
  plugins: [],
};


