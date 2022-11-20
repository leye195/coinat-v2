import { css } from '@emotion/react';
import { BreakPoints, breakpointsValue, Size } from '@/styles/variables';

type Flex = {
  display?: 'flex' | 'inline-flex';
  direction?: 'row' | 'column' | 'column-reverse' | 'row-reverse';
  alignItems?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'start'
    | 'end'
    | 'revert'
    | 'baseline'
    | 'inherit';
  justifyContents?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-around'
    | 'space-between'
    | 'space-evenly'
    | 'start'
    | 'end';
};

export const flex = ({
  display = 'flex',
  direction = 'row',
  alignItems = 'flex-start',
  justifyContents = 'flex-start',
}: Flex) => css`
  display: ${display};
  flex-direction: ${direction};
  align-items: ${alignItems};
  justify-content: ${justifyContents};
`;

export const breakpoint = (key: Size) => {
  const breakUp = (...args: any) => css`
    @media (min-width: ${breakpointsValue[key as Size]}px) {
      ${css(...args)};
    }
  `;

  const breakDown = (...args: any) => css`
    @media (max-width: ${breakpointsValue[key as Size]}px) {
      ${css(...args)};
    }
  `;

  return {
    up: breakUp,
    down: breakDown,
  };
};

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
