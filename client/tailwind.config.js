/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#fb7f0c',
        green: '#40c22b',
        yellow: '#ffca67',
        brown: '#7d3f06',
        gray: '#7d7b7b',
        white: '#ffffff',
        black: '#000000',
        red: '#d2042d',
        light: '#fef2e6',
        light_purple: '#f4ebfc',
        light_pink: '#ffd1df',
        light_yellow: '#e0cda9',
        light_gray: '#d3d3d3',
        light_primary: '#ffddb3',
        light_green: '#ebf9f1',
        super_light_purple: '#f7f6fe',
        pink: '#FA3694',
        primary_dark: '#CE6B0F',
        another_primary: '#ee9a4b',
        info: '#ffc107',
        hero: '#efa37f',
        blue: '#24acf2',
        dark_blue: '#063E77',
        purple: '#be84ff',
        anotherRed: '#f61818',
      },
      screens: {
        md2: '850px',
      },
    },
  },
  plugins: [],
};
