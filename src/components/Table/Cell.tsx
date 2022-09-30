import styled from '@emotion/styled';
import type { ComponentProps } from 'react';

import { flex } from '@/styles/mixin';
import { spacing } from '@/styles/variables';

const Container = styled.div`
  ${flex({ alignItems: 'center' })};
  padding: ${spacing.xs};
  width: 30%;
  height: 100%;
`;

const Cell = ({ children }: ComponentProps<'div'>) => {
  return <Container>{children}</Container>;
};

export default Cell;
