export type Theme = {
  rem: (number: number) => string;
  color: {
    [key in string]: string;
  };
};

const rem = (num: number): string => `${(num / 16).toFixed(4)}rem`;

export const globalTheme: Theme = {
  rem,
  color: {
    black: '#252323',
    white: '#ffffff',
    gray: '#d0d0d0',
    primary: '#3772FF',
    best: '#FF7058',
    skeletonStart: '#EDF2F7',
    skeletonEnd: '#A0AEC0',
  },
};
