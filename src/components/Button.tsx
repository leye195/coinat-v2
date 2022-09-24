import styled from '@emotion/styled';
import type { ComponentPropsWithoutRef } from 'react';
import type { Spacing } from 'types/Style';

type Props = {
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
`;

const Button = ({
  children,
  onClick,
  bgColor,
  color,
  padding,
  type = 'button',
  ...rest
}: Props) => {
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
