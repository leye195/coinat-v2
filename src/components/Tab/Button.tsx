import { cn } from '@/lib/utils';
import Button, { ButtonProps } from '../Button';

type Props = {
  isActive?: boolean;
} & ButtonProps;

const TabButton = ({ children, isActive, ...rest }: Props) => {
  return (
    <div
      className={cn(
        'relative flex',
        'after:absolute after:bottom-0 after:w-full after:h-[3px] after:content-[""]',
        isActive ? 'after:bg-[#f8b64c]' : 'after:bg-transparent',
      )}
    >
      <Button
        {...rest}
        className={cn('max-md:!p-2 max-md:!text-xs', 'max-sm:!p-[0.35rem]')}
        padding={{
          top: '0.75rem',
          bottom: '0.75rem',
          left: '1rem',
          right: '1rem',
        }}
      >
        {children}
      </Button>
    </div>
  );
};

export default TabButton;
