import { useState } from 'react';
import styled from '@emotion/styled';

import { flex } from '@/styles/mixin';

import AccordionButton from '@/components/Accordion/Button';
import AccordionPanel from '@/components/Accordion/Pannel';

type Props = {
  title: string | JSX.Element | JSX.Element[];
  children: JSX.Element | React.ReactElement;
  defaultIsOpen?: boolean;
  headerIcon?: JSX.Element;
  disabled?: boolean;
};

const HeaderBox = styled.div`
  ${flex({ alignItems: 'center', justifyContents: 'space-between' })};
  width: inherit;
`;

const Container = styled.div`
  ${flex({ direction: 'column' })};
  width: 100%;
  background-color: white;
`;

const Accordion = ({
  title,
  headerIcon,
  children,
  defaultIsOpen = false,
  disabled = false,
}: Props) => {
  const [isOpen, handleOpen] = useState(defaultIsOpen);

  return (
    <Container>
      <AccordionButton
        className="accordion__button"
        disabled={disabled}
        onClick={() => handleOpen((prev) => !prev)}
        aria-expanded={isOpen ? 'true' : 'false'}
      >
        <HeaderBox>
          {title}
          {!!headerIcon && headerIcon}
        </HeaderBox>
      </AccordionButton>
      <AccordionPanel isOpen={isOpen}>{children}</AccordionPanel>
    </Container>
  );
};

Accordion.Button = AccordionButton;
Accordion.Panel = AccordionPanel;

export default Accordion;
