import type { Config } from 'tailwindcss';

const config: Config = {
  mode: 'jit',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        night: {
          '50': '#DDDDE3',
          '100': '#C7C7D1',
          '150': '#B0B0BF',
          '200': '#A5A5B6',
          '250': '#9A9AAC',
          '300': '#8F8FA3',
          '350': '#84849A',
          '400': '#787891',
          '450': '#6E6E87',
          '500': '#5C5C70',
          '550': '#49495A',
          '600': '#40404F',
          '650': '#373743',
          '700': '#2E2E38',
          '750': '#25252D',
          '800': '#1C1C22',
          '850': '#151519',
          '900': '#101014',
          '925': '#09090b',
          '950': '#050506',
        },
      },
      height: { screen: '100dvh' },
    },
  },
  plugins: [],
};
export default config;
