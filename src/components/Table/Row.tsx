import { breakpoint, flex } from '@/styles/mixin';
import styled from '@emotion/styled';
import type { ComponentProps } from 'react';

const Container = styled.div`
  ${flex({ alignItems: 'center' })}
  border-bottom: 1px solid ${({ theme }) => theme.color.gray};

  ${breakpoint('md').down`
    font-size: 12px;
  `}
`;

const Row = ({ children }: ComponentProps<'div'>) => {
  return <Container>{children}</Container>;
};

export default Row;
