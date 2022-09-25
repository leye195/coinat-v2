/**
 * Breakpoint
 */

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type BreakPoints = Record<Size, number>;
export const breakpoints: BreakPoints = {
  xs: 0,
  sm: 480,
  md: 753,
  lg: 1024,
  xl: 1265,
};

/**
 * Spacing
 */

export type SpacingType =
  | 'xxs'
  | 'xs'
  | 's'
  | 'm'
  | 'l'
  | 'xl'
  | 'xxl'
  | 'xxxl';
export type SpacingNumber = Record<SpacingType, number>;
export type Spacing = Record<SpacingType, string>;

const spacingNumber: SpacingNumber = {
  xxs: 4,
  xs: 8,
  s: 12,
  m: 16,
  l: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const spacing: Spacing = Object.keys(spacingNumber).reduce(
  (acc, cur) => {
    acc[cur as SpacingType] = `${spacingNumber[cur as SpacingType]}px`;
    return acc;
  },
  {} as Spacing,
);
