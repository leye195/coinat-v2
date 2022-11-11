import { breakpoint, flex } from '@/styles/mixin';
import styled from '@emotion/styled';
import type { ComponentProps } from 'react';

const Container = styled.div`
  ${flex({ alignItems: 'center' })}
  min-height: 50px;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray};

  &:last-child {
    border-bottom: none;
  }

  ${breakpoint('md').down`
    min-height: 45px;
    font-size: 12px;
  `}

  ${breakpoint('sm').down`
    min-height: 40px;
    font-size: 10px;
  `}
`;

const Row = ({ children }: ComponentProps<'div'>) => {
  return <Container>{children}</Container>;
};

export default Row;
