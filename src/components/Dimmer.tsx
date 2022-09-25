import styled from '@emotion/styled';
import type { ComponentProps } from 'react';
import { flex } from '@/styles/mixin';

const Container = styled.div`
  ${flex({ alignItems: 'center', justifyContents: 'center' })};
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(21, 22, 25, 0.5);
  z-index: 1000;
`;

const Dimmer = ({ children, ...rest }: ComponentProps<'div'>) => {
  return <Container {...rest}>{children}</Container>;
};

export default Dimmer;
