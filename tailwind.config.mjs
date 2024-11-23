const { twTypographyMap } = require('ownui-system');
const plugin = require('tailwindcss/plugin');

const config = {
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
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      // Add your custom styles here
      addUtilities(twTypographyMap, ['responsive', 'hover']);
    }),
  ],
};
export default config;
