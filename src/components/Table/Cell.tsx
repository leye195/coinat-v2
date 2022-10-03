import styled from '@emotion/styled';
import type { ComponentProps } from 'react';

import { flex } from '@/styles/mixin';
import { spacing } from '@/styles/variables';

const Container = styled.div<{ color?: string }>`
  ${flex({ alignItems: 'center' })};
  padding: ${spacing.xs};
  width: 30%;
  height: 100%;
  font-weight: 400;
  color: ${({ color }) => color ?? '#000000'};
`;

const Cell = ({ children, color }: ComponentProps<'div'>) => {
  return <Container color={color}>{children}</Container>;
};

export default Cell;
