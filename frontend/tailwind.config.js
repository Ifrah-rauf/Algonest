// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
  extend: {

    animation: {
      "roadmap-scroll": "roadmapScroll 90s linear infinite",
    },

    keyframes: {

      roadmapScroll: {

        "0%": {
          transform: "translateX(0)"
        },

        "100%": {
          transform: "translateX(-50%)"
        }

      }

    }

  },
},
  plugins: [],
};

