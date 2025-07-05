import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

export type ButtonProps = ComponentPropsWithoutRef<'button'>;

const Button = ({
  children,
  onClick,
  className,
  type = 'button',
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'bg-white text-black p-2 w-auto',
        'cursor-pointer disabled:cursor-not-allowed',
        className,
      )}
      type={type}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
