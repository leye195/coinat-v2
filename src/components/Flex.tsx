import styled from '@emotion/styled';
import { CSSProperties } from 'react';

type FlexProps = {
  display?: 'flex' | 'inline-flex';
  alignItems?: CSSProperties['alignItems'];
  justifyContent?: CSSProperties['justifyContent'];
  gap?: CSSProperties['gap'];
  flexDirection?: CSSProperties['flexDirection'];
};

export const Flex = styled.div<FlexProps>`
  display: ${({ display }) => display ?? 'flex'};
  align-items: ${({ alignItems }) => alignItems ?? 'flex-start'};
  justify-content: ${({ justifyContent }) => justifyContent ?? 'flex-start'};
  gap: ${({ gap }) => gap ?? 0};
  flex-direction: ${({ flexDirection }) => flexDirection ?? 'row'};
`;
