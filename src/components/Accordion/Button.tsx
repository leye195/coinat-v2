import styled from '@emotion/styled';
import { ComponentProps } from 'react';

type Props = {
  disabled?: boolean;
} & ComponentProps<'div'>;

const Button = styled.div<{ disabled?: boolean }>`
  width: inherit;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

const AccordionButton = ({ children, disabled, onClick, ...props }: Props) => {
  return (
    <Button
      {...props}
      disabled={disabled}
      role="button"
      tabIndex={0}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </Button>
  );
};

export default AccordionButton;
