import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

const Dimmer = ({ children, className, ...rest }: ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        'w-screen h-screen fixed top-0 left-0',
        'bg-[#1516197f] z-[1000]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Dimmer;
