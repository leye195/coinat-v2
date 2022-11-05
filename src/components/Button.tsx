import styled from '@emotion/styled';
import type { ComponentPropsWithoutRef, CSSProperties } from 'react';
import type { Spacing } from 'types/Style';

export type ButtonProps = {
  onClick?: () => void;
  bgColor?: string;
  color?: string;
  padding?: Spacing;
} & ComponentPropsWithoutRef<'button'>;

const Container = styled.button<{
  bgColor?: string;
  color?: string;
  padding?: Spacing;
}>`
  padding: ${({ padding }) =>
    `${padding?.top ?? `0.5`}rem ${padding?.right ?? '0.5'}rem ${
      padding?.bottom ?? '0.5'
    }rem ${padding?.left ?? '0.5'}rem `};
  background-color: ${({ bgColor }) => bgColor ?? '#ffffff'};
  color: ${({ color }) => color ?? '#000000'};

  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
`;

const Button = ({
  children,
  onClick,
  bgColor,
  color,
  padding,
  type = 'button',
  ...rest
}: ButtonProps) => {
  return (
    <Container
      bgColor={bgColor}
      color={color}
      type={type}
      padding={padding}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Container>
  );
};

export default Button;
