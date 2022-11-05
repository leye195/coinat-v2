import styled from '@emotion/styled';
import { ComponentProps } from 'react';
import { flex } from '@/styles/mixin';

const Container = styled.div`
  ${flex({ alignItems: 'center' })};
  background-color: white;
  border: 1px solid #d0d0d0;

  * {
    flex: 1;
    border: none;
  }
`;

const Group = ({ children }: ComponentProps<'div'>) => {
  return <Container>{children}</Container>;
};

export default Group;
