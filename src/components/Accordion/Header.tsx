import { useCallback, useEffect } from 'react';
import { useAccordionGlobalContext, useAccordionContext } from './Context';
import AccordionButton from './Button';

type Props = {
  children: JSX.Element | React.ReactElement;
  disabled?: boolean;
};

const Header = ({ children, disabled = false }: Props) => {
  const { allowMulti, handleItem } = useAccordionGlobalContext();
  const { index, isOpen, setIsOpen } = useAccordionContext();
  const { isOpen: isItemOpen, onChange } = handleItem?.(index) ?? {};

  const handleClick = useCallback(
    (isOpen: boolean) => {
      if (index == null) return;

      if (allowMulti) {
        setIsOpen?.(isOpen);
        return;
      }

      onChange?.(isOpen);
    },
    [index, allowMulti, onChange, setIsOpen],
  );

  useEffect(() => {
    if (!allowMulti) setIsOpen?.(!!isItemOpen);
  }, [allowMulti, isItemOpen, setIsOpen]);

  return (
    <AccordionButton
      className="accordion__button"
      disabled={disabled}
      onClick={() => handleClick(!isOpen)}
      aria-expanded={isOpen ? 'true' : 'false'}
    >
      {children}
    </AccordionButton>
  );
};

export default Header;
