import { useAccordionContext } from '.';
import AccordionButton from './Button';

type Props = {
  children: JSX.Element | React.ReactElement;
  disabled?: boolean;
};

const Header = ({ children, disabled = false }: Props) => {
  const { isOpen, setIsOpen } = useAccordionContext();
  return (
    <AccordionButton
      className="accordion__button"
      disabled={disabled}
      onClick={() => setIsOpen?.((prev) => !prev)}
      aria-expanded={isOpen ? 'true' : 'false'}
    >
      {children}
    </AccordionButton>
  );
};

export default Header;
