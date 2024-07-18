import { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type Props = ComponentProps<'div'>;

const List = ({ children }: Props) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        'min-h-[12rem] max-h-[12.5rem] w-[20rem]',
        'p-3 border border-[#e1e1e1] border-l-0 border-r-0 overflow-hidden',
        'max-xl:w-full',
      )}
    >
      {children}
    </div>
  );
};

export default List;
