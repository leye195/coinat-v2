import { css } from '@emotion/react';

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
