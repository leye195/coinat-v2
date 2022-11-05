import { flex } from '@/styles/mixin';
import styled from '@emotion/styled';
import Button, { ButtonProps } from '../Button';

type Props = {
  isActive?: boolean;
} & ButtonProps;

const ButtonBox = styled.div<{ isActive?: boolean }>`
  ${flex({})}
  position: relative;

  &::after {
    position: absolute;
    content: '';
    bottom: 0;
    height: 3px;
    width: 100%;
    background-color: ${({ isActive }) =>
      isActive ? '#f8b64c' : 'transparent'};
  }
`;

const TabButton = ({ children, isActive, ...rest }: Props) => {
  return (
    <ButtonBox isActive={isActive}>
      <Button
        {...rest}
        padding={{
          top: '1',
          bottom: '1',
          left: '1',
          right: '1',
        }}
      >
        {children}
      </Button>
    </ButtonBox>
  );
};

export default TabButton;
