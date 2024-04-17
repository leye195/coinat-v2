import styled from '@emotion/styled';
import { CSSProperties } from 'react';

type TextProps = {
  fontSize?: CSSProperties['fontSize'];
  fontWeight?: CSSProperties['fontWeight'];
  color?: CSSProperties['color'];
};

export const Text = styled.span<TextProps>`
  font-size: ${({ fontSize }) => fontSize ?? '16px'};
  font-weight: ${({ fontWeight }) => fontWeight ?? 400};
  color: ${({ color }) => color ?? 'black'};
`;
