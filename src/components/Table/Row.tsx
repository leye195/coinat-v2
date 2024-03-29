import { breakpoint, flex } from '@/styles/mixin';
import styled from '@emotion/styled';
import type { ComponentProps } from 'react';

const Container = styled.div`
  ${flex({ alignItems: 'center' })}
  border-bottom: 1px solid ${({ theme }) => theme.color.gray};

  &:last-child {
    border-bottom: none;
  }

  ${breakpoint('lg').down`
    font-size: 14px;
  `}

  ${breakpoint('md').down`
    font-size: 12px;
  `}

  ${breakpoint('sm').down`
    font-size: 10px;
  `}
`;

const Row = ({ children }: ComponentProps<'div'>) => {
  return <Container>{children}</Container>;
};

export default Row;
