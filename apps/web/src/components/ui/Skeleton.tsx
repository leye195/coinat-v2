import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  fadeDuration?: number;
  startColor?: string;
  endColor?: string;
  children?: React.ReactNode;
  isLoaded?: boolean;
} & CSSProperties;

const Skeleton = (props: Props) => {
  return (
    <div
      style={{
        ...props,
      }}
      className={cn(
        'bg-clip-padding bg-transparent opacity-70',
        !props.isLoaded && 'animate-skeleton',
      )}
    >
      {props.children}
    </div>
  );
};

export default Skeleton;
