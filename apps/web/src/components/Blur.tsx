import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type Props = ComponentProps<'div'>;

const Blur = ({ children, onClick }: Props) => {
  return (
    <div
      className={cn(
        'fixed top-0 left-0 z-[100]',
        'flex items-center justify-center',
        'bg-black/40 backdrop-blur-2xl',
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Blur;
