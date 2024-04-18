import styled from '@emotion/styled';
import type { ComponentProps } from 'react';

import { flex } from '@/styles/mixin';
import { spacing } from '@/styles/variables';

type CellProps = {
  width?: string;
} & ComponentProps<'div'>;

const Container = styled.div<{ color?: string; width?: string }>`
  ${flex({ alignItems: 'center' })};
  padding: ${spacing.xxs} ${spacing.xs};
  width: ${({ width }) => width ?? '30%'};
  height: 100%;
  font-weight: 400;
  color: ${({ color }) => color ?? '#000000'};
`;

const Cell = ({ children, color, width }: CellProps) => {
  return (
    <Container color={color} width={width}>
      {children}
    </Container>
  );
};

export default Cell;
