import { useState } from 'react';
import { AccordionGlobalContext } from './Context';

type Props = {
  children: React.ReactNode;
  allowMulti?: boolean;
};

const Wrapper = ({ children, allowMulti = false }: Props) => {
  const [index, setIndex] = useState<number | null | undefined>();
  const handleItem = (idx?: number | null) => {
    let isOpen = false;

    if (idx != null) {
      isOpen = index === idx;
    }

    const onChange = (isOpen: boolean) => {
      if (idx === null) return;

      if (isOpen) setIndex(idx);
      else setIndex(-1);
    };

    return { isOpen, onChange };
  };

  return (
    <AccordionGlobalContext.Provider
      value={{
        allowMulti,
        index,
        handleItem,
      }}
    >
      {children}
    </AccordionGlobalContext.Provider>
  );
};

export default Wrapper;
