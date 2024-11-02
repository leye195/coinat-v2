import styled from '@emotion/styled';
import { breakpoint, flex } from '@/styles/mixin';
import Button, { ButtonProps } from '../Button';

type Props = {
  isActive?: boolean;
} & ButtonProps;

const ButtonBox = styled.div<{ isActive?: boolean }>`
  ${flex({})}
  position: relative;

  &::after {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 3px;
    background-color: ${({ isActive }) =>
      isActive ? '#f8b64c' : 'transparent'};
    content: '';
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
          top: '0.75rem',
          bottom: '0.75rem',
          left: '1rem',
          right: '1rem',
        }}
      >
        {children}
      </Button>
    </ButtonBox>
  );
};

export default TabButton;
