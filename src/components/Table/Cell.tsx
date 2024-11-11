import type { ComponentProps } from 'react';
import styled from '@emotion/styled';
import { flex } from '@/styles/mixin';
import { spacing } from '@/styles/variables';

type CellProps = {
  width?: string;
} & ComponentProps<'div'>;

const Container = styled.div<{ color?: string; width?: string }>`
  width: ${({ width }) => width ?? '30%'};
  height: 100%;
  padding: ${spacing.xxs} ${spacing.xs};
  color: ${({ color }) => color ?? '#000000'};
  font-weight: 400;

  ${flex({ alignItems: 'center' })};
`;

const Cell = ({ children, color, width }: CellProps) => {
  return (
    <Container color={color} width={width}>
      {children}
    </Container>
  );
};

export default Cell;
