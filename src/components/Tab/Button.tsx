import { cn } from '@/lib/utils';
import Button, { ButtonProps } from '../Button';

type Props = {
  isActive?: boolean;
} & ButtonProps;

const TabButton = ({ children, isActive, className, ...rest }: Props) => {
  return (
    <div
      className={cn(
        'relative flex',
        'after:absolute after:bottom-0 after:w-full after:h-[3px] after:content-[""]',
        isActive ? 'after:bg-[#f8b64c]' : 'after:bg-transparent',
      )}
    >
      <Button
        className={cn(
          'px-4 py-3',
          'max-md:p-2 max-md:text-xs',
          'max-sm:p-[0.35rem]',
          className,
        )}
        {...rest}
      >
        {children}
      </Button>
    </div>
  );
};

export default TabButton;
