import styled from '@emotion/styled';
import type { ComponentProps } from 'react';
import { breakpoint, flex } from '@/styles/mixin';

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

const Row = ({ children, style }: ComponentProps<'div'>) => {
  return <Container style={style}>{children}</Container>;
};

export default Row;
