import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

const Row = ({ children, style, className }: ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'flex items-center w-full max-lg:text-[14px] max-md:text-[12px] max-sm:text-[10px]',
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
};

export default Row;
