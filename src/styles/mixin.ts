import { css } from '@emotion/react';
import { breakpoints, Size } from '@/styles/variables';

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
    @media (min-width: ${breakpoints[key as Size]}px) {
      ${css(...args)};
    }
  `;

  const breakDown = (...args: any) => css`
    @media (max-width: ${breakpoints[key as Size]}px) {
      ${css(...args)};
    }
  `;

  return {
    up: breakUp,
    down: breakDown,
  };
};
