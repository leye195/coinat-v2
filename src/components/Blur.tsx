import styled from '@emotion/styled';
import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'>;

const Container = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(50px);
  z-index: 100;
`;

const Blur = ({ children, onClick }: Props) => {
  return <Container onClick={onClick}>{children}</Container>;
};

export default Blur;
