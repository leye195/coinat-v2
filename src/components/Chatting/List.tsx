import { ComponentProps } from 'react';
import styled from '@emotion/styled';

import { breakpoint, flex } from '@/styles/mixin';
import { spacing } from '@/styles/variables';

type Props = ComponentProps<'div'>;

const Container = styled.div`
  ${flex({ direction: 'column' })};
  gap: ${spacing.s};
  min-height: 12rem;
  max-height: 12.5rem;
  width: 20rem;
  padding: ${spacing.s};
  border: 1px solid #e1e1e1;
  border-left: none;
  border-right: none;
  overflow: auto;

  ${breakpoint('xl').down`
    width: 100%;
  `};
`;

const List = ({ children }: Props) => {
  return <Container>{children}</Container>;
};

export default List;
