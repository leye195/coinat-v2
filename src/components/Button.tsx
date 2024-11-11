import type { ComponentPropsWithoutRef } from 'react';
import styled from '@emotion/styled';
import type { Spacing } from '@/types/Style';

export type ButtonProps = {
  bgColor?: string;
  color?: string;
  padding?: Spacing;
  border?: string;
  borderRadius?: string;
  width?: string;
} & ComponentPropsWithoutRef<'button'>;

const Container = styled.button<{
  bgColor?: string;
  color?: string;
  padding?: Spacing;
  border: string;
  borderRadius: string;
  width?: string;
}>`
  width: ${({ width }) => width ?? 'auto'};
  padding: ${({ padding }) =>
    `${padding?.top ?? `0.5rem`} ${padding?.right ?? '0.5rem'} ${
      padding?.bottom ?? '0.5rem'
    } ${padding?.left ?? '0.5rem'}`};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
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
  width,
  border = 'none',
  borderRadius = '0',
  type = 'button',
  ...rest
}: ButtonProps) => {
  return (
    <Container
      border={border}
      borderRadius={borderRadius}
      bgColor={bgColor}
      color={color}
      type={type}
      padding={padding}
      width={width}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Container>
  );
};

export default Button;
