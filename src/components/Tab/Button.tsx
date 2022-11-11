import { breakpoint, flex } from '@/styles/mixin';
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

  ${breakpoint('md').down`
     button {
      padding: 0.5rem;
      font-size: 12px;
     }
  `}

  ${breakpoint('sm').down`
    button {
      padding: 0.35rem;
    }
  `}
`;

const TabButton = ({ children, isActive, ...rest }: Props) => {
  return (
    <ButtonBox isActive={isActive}>
      <Button
        {...rest}
        padding={{
          top: '0.75',
          bottom: '0.75',
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
