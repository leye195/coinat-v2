import { useState } from 'react';
import styled from '@emotion/styled';

import { flex } from '@/styles/mixin';
import AccordionButton from '@/components/Accordion/Button';
import { AccordionContext } from '@/components/Accordion/Context';
import AccordionPanel from '@/components/Accordion/Pannel';
import AccordionWrapper from '@/components/Accordion/Wrapper';
import AccordionHeader from '@/components/Accordion/Header';

type Props = {
  title: string | JSX.Element | JSX.Element[];
  children: JSX.Element | React.ReactElement;
  defaultIsOpen?: boolean;
  headerIcon?: JSX.Element;
  disabled?: boolean;
  index?: number;
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
  index = -1,
}: Props) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);
  const value = {
    isOpen,
    index,
    setIsOpen,
  };

  return (
    <AccordionContext.Provider value={value}>
      <Container>
        <AccordionHeader disabled={disabled}>
          <HeaderBox>
            {title}
            {!!headerIcon && headerIcon}
          </HeaderBox>
        </AccordionHeader>
        <AccordionPanel>{children}</AccordionPanel>
      </Container>
    </AccordionContext.Provider>
  );
};

Accordion.Button = AccordionButton;
Accordion.Panel = AccordionPanel;
Accordion.Wrapper = AccordionWrapper;

export default Accordion;
