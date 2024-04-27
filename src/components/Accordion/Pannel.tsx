import styled from '@emotion/styled';
import React, { ComponentProps, useRef } from 'react';
import useMountTransition from '@/hooks/useMountTransition';
import { classnames } from '@/lib/utils';

type Props = {
  isOpen: boolean;
  children: React.ReactElement;
} & ComponentProps<'div'>;

const BodyBox = styled.section`
  width: inherit;
  padding: 0;
  overflow: hidden;
  transition: all 0.25s ease-out;
`;

const Container = styled.div`
  width: auto;
  height: auto;
`;

const AccordionPanel = ({ isOpen, children, ...props }: Props) => {
  const isTransitioning = useMountTransition(isOpen, 250);
  const ref = useRef<HTMLDivElement>(null);

  if (!isOpen && !isTransitioning) return null;

  return (
    <BodyBox
      className={classnames(isOpen && isTransitioning ? 'open' : 'close')}
      style={{
        height: ref.current && isOpen ? ref.current.clientHeight : 0,
      }}
    >
      <Container {...props}>{React.cloneElement(children, { ref })}</Container>
    </BodyBox>
  );
};

export default AccordionPanel;
