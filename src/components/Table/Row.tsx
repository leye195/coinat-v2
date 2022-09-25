import styled from '@emotion/styled';
import type { ComponentProps } from 'react';

const Container = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.color.gray};
`;

const Row = ({ children }: ComponentProps<'div'>) => {
  return <Container>{children}</Container>;
};

export default Row;
