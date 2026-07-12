import { type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type DividerProps = {
  type: 'horizontal' | 'vertical';
  size: string;
  color?: string;
} & ComponentProps<'div'>;

export const Divider = ({
  type,
  size,
  color = '#eee',
  style,
}: DividerProps) => (
  <div
    className={cn(
      type === 'horizontal' && 'w-0 h-[var(--size)]',
      type === 'vertical' && 'h-0 w-[var(--size)]',
      'bg-[var(--color)]',
    )}
    style={{
      '--size': size,
      '--color': color,
      ...style,
    }}
  />
);
