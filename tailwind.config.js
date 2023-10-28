/** @type {import('tailwindcss').Config} */

module.exports = {

  content: [
    "./index.html",
    './public/index.html',
    './src/**/*.{vue,js,ts}',
    './src/views/**/*.{vue,js,ts}',
    './src/components/**/*.{vue,js,ts}',
  ],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
      "2xl": "1680px",
      phone: { min: "320px", max: "480px" },
      laptop: { min: "1024px", max: "1440px" },
      pc: { min: "1441px" },
    },
    boxShadow: {
      DEFAULT: "0px 4px 10px rgba(191, 202, 213, 0.25)",
    },
    fontSize: {
      sm: "10px",
      base: "12px",
      lg: "14px",
      xl: "16px",
      "2xl": "18px",
      "3xl": "28px",
      "4xl": "38px",
      "5xl": "48px",
      "6xl": "60px",
    },
    extend: {
      colors: {
        moss: {
          50: '#f0f9f3',
          100: '#dbf0e1',
          200: '#a8d8b9',
          300: '#8cc9a6',
          400: '#5cab7f',
          500: '#3a8f63',
          600: '#29724d',
          700: '#215b40',
          800: '#1c4934',
          900: '#183c2c',
          950: '#0c2219',
        },
        'tumbleweed': {
          '50': '#fcf6f0',
          '100': '#f8eadc',
          '200': '#efd2b9',
          '300': '#e1a679',
          '400': '#da8b5d',
          '500': '#d26e3d',
          '600': '#c35933',
          '700': '#a2452c',
          '800': '#82392a',
          '900': '#6a3124',
          '950': '#391711',
        },

        mandy: {
          50: '#fef2f3',
          100: '#fde6e7',
          200: '#fbd0d5',
          300: '#f7aab2',
          400: '#f27a8a',
          500: '#ea546c',
          600: '#d5294d',
          700: '#b31d3f',
          800: '#961b3c',
          900: '#811a39',
          950: '#48091a',
        },
        customBg: {
          100: "#EFF2F4",
        },
        kamenozoki: {
          100: "#6699A1",
          200: "#78C2C4",
          300: "#6699A1",
          400: "#376B6D",
        },
        mizu: {
          100: "#81C7D4",
          200: "#33A6B8",
          300: "#0089A7",
        },
        torinoko: {
          50: "#F1F9F9",
          100: "#DAC9A6",
        },
        'red-ribbon': {
          '50': '#fff0f2',
          '100': '#ffdee2',
          '200': '#ffc3cb',
          '300': '#ff99a7',
          '400': '#ff5f74',
          '500': '#ff2d49',
          '600': '#f51432',
          '700': '#ce0722',
          '800': '#aa0a1f',
          '900': '#8c1021',
          '950': '#4d020c',
        },
        'empress': {
          '50': '#f8f7f7',
          '100': '#efefef',
          '200': '#dddada',
          '300': '#bfbaba',
          '400': '#9b9596',
          '500': '#7a7374',
          '600': '#686162',
          '700': '#554f50',
          '800': '#484445',
          '900': '#3f3b3b',
          '950': '#2a2727',
        },


      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}

