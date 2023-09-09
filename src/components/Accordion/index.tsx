import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import styled from '@emotion/styled';

import { flex } from '@/styles/mixin';
import AccordionButton from '@/components/Accordion/Button';
import AccordionPanel from '@/components/Accordion/Pannel';
import Header from './Header';

type Props = {
  title: string | JSX.Element | JSX.Element[];
  children: JSX.Element | React.ReactElement;
  defaultIsOpen?: boolean;
  headerIcon?: JSX.Element;
  disabled?: boolean;
};

type AccordionConextType = {
  isOpen: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
};

export const AccordionContext = createContext<AccordionConextType>({
  isOpen: false,
});
export const useAccordionContext = () => useContext(AccordionContext);

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
  const [isOpen, setIsOpen] = useState(defaultIsOpen);
  const value = {
    isOpen,
    setIsOpen,
  };

  return (
    <AccordionContext.Provider value={value}>
      <Container>
        <Header disabled={disabled}>
          <HeaderBox>
            {title}
            {!!headerIcon && headerIcon}
          </HeaderBox>
        </Header>
        <AccordionPanel>{children}</AccordionPanel>
      </Container>
    </AccordionContext.Provider>
  );
};

Accordion.Button = AccordionButton;
Accordion.Panel = AccordionPanel;

export default Accordion;
