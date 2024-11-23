import { twTypographyMap } from 'ownui-system';
import type { Config } from 'tailwindcss';
const plugin = require('tailwindcss/plugin');

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/ownui-system/dist/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '753px',
      lg: '1024px',
      xl: '1265px',
    },
    extend: {
      keyframes: {
        skeleton: {
          from: {
            borderColor: '#EDF2F7', // gray-100
            backgroundColor: '#EDF2F7', // gray-100
          },
          to: {
            borderColor: '#A0AEC0', // gray-400
            backgroundColor: '#A0AEC0', // gray-400
          },
        },
      },
      animation: {
        skeleton:
          'skeleton 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate',
      },
    },
  },

  plugins: [
    plugin(function ({ addUtilities }) {
      // Add your custom styles here
      addUtilities(twTypographyMap, ['responsive', 'hover']);
    }),
  ],
};
export default config;
