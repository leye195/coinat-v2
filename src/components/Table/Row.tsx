import type { ComponentProps } from 'react';

const Row = ({ children, style }: ComponentProps<'div'>) => {
  return (
    <div
      className="flex items-center w-full border-b last:border-0 max-lg:text-[14px] max-md:text-[12px] max-sm:text-[10px]"
      style={style}
    >
      {children}
    </div>
  );
};

export default Row;
