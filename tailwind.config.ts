import type { Config } from 'tailwindcss';
const { colors, twTypographyMap } = require('ownui-system');
const plugin = require('tailwindcss/plugin');

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/ownui-system/dist/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {},
  plugins: [
    plugin(function ({ addUtilities }) {
      // Add your custom styles here
      addUtilities(twTypographyMap, ['responsive', 'hover']);
    }),
  ],
};
export default config;
