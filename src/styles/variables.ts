// breakpoints

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type BreakPoints = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
};

export const breakpoints: BreakPoints = {
  xs: 0,
  sm: 480,
  md: 753,
  lg: 1024,
  xl: 1265,
};
