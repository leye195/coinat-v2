import { BreakPoints, breakpointsValue, Size } from '@/styles/variables';

const breakpointsValueList = Object.values(breakpointsValue);
export const breakpoints: BreakPoints = {
  up: (key: Size) => `@media (min-width: ${breakpointsValue[key]}px)`,
  down: (key: Size) => `@media (max-width: ${breakpointsValue[key]}px)`,
  values: (key: Size) => breakpointsValue[key],
  between: (start: Size, end: Size) => {
    const endIndex = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].indexOf(end);
    const startIndex = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].indexOf(start);

    return `@media (min-width: ${
      breakpointsValueList[startIndex]
    }px) and (max-width: ${breakpointsValueList[endIndex] - 1}px)`;
  },
} as BreakPoints;
