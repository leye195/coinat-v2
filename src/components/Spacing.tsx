import { cn } from '@/lib/utils';

type SpacingProps = {
  type?: 'vertical' | 'horizontal';
  size: string;
};

const Spacing = ({ type = 'horizontal', size }: SpacingProps) => (
  <div
    className={cn(
      type === 'vertical' && 'w-0 h-[var(--size)]',
      type === 'horizontal' && 'w-[var(--size)] h-0',
    )}
    style={{
      '--size': size,
    }}
  />
);

export default Spacing;
