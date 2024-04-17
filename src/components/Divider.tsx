import styled from '@emotion/styled';

type DividerProps = {
  type: 'horizontal' | 'vertical';
  size: string;
  color?: string;
};

export const Divider = styled.div<DividerProps>`
  width: ${({ size, type }) => (type === 'horizontal' ? 0 : size)};
  height: ${({ size, type }) => (type === 'vertical' ? 0 : size)};
  background-color: ${({ color }) => color ?? '#eee'};
`;
