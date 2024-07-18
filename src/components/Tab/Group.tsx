import { type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

const Group = ({ children, className }: ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'flex items-center bg-white relative [&_*]:flex-1',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Group;
