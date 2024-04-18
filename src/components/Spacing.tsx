import styled from '@emotion/styled';

type SpacingProps = {
  type?: 'vertical' | 'horizontal';
  size: string;
};

export const Spacing = styled.div<SpacingProps>`
  width: ${({ type, size }) => (type === 'vertical' ? 0 : size)};
  height: ${({ type, size }) => (type === 'vertical' ? size : 0)};
`;
