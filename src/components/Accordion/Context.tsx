import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from 'react';

type AccordionGlobalContextType = {
  index?: number | null;
  allowMulti?: boolean;
  handleItem?: (idx?: number | null) => {
    isOpen: boolean;
    onChange: (isOpen: boolean) => void;
  };
};

type AccordionConextType = {
  isOpen: boolean;
  index?: number;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
};

export const AccordionGlobalContext = createContext<AccordionGlobalContextType>(
  { allowMulti: false },
);

export const useAccordionGlobalContext = () =>
  useContext(AccordionGlobalContext);

export const AccordionContext = createContext<AccordionConextType>({
  isOpen: false,
});

export const useAccordionContext = () => useContext(AccordionContext);
