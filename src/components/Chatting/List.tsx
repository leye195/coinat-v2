import { ComponentProps } from 'react';
import styled from '@emotion/styled';

import { flex } from '@/styles/mixin';
import { spacing } from '@/styles/variables';

type Props = ComponentProps<'div'>;

const Container = styled.div`
  ${flex({ direction: 'column', alignItems: 'center' })};
  gap: ${spacing.xs};
  min-height: 6rem;
  border: 1px solid #e1e1e1;
  border-left: none;
  border-right: none;
`;

const List = ({ children }: Props) => {
  return <Container>{children}</Container>;
};

export default List;
