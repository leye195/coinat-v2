import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type CellProps = {
  width?: string;
} & ComponentProps<'div'>;

const Cell = ({ children, color, width }: CellProps) => {
  return (
    <div
      className={cn(
        'h-full font-normal flex items-center px-2 py-1',
        'text-[var(--color)] w-[var(--width)]',
      )}
      style={{
        '--color': color ?? '#000000',
        '--width': width ?? '30%',
      }}
    >
      {children}
    </div>
  );
};

export default Cell;
