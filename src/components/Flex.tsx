import type { ComponentProps, CSSProperties } from 'react';

type FlexProps = {
  display?: 'flex' | 'inline-flex';
  alignItems?: CSSProperties['alignItems'];
  justifyContent?: CSSProperties['justifyContent'];
  gap?: string;
  flexDirection?: CSSProperties['flexDirection'];
  isFull?: boolean;
  className?: string;
} & ComponentProps<'div'>;

export const Flex = ({
  children,
  display,
  alignItems,
  justifyContent,
  gap,
  flexDirection,
  isFull,
  className,
  style,
  ...restProps
}: FlexProps) => {
  return (
    <div
      className={className}
      style={{
        display: display ?? 'flex',
        alignItems: alignItems ?? 'flex-start',
        justifyContent: justifyContent ?? 'flex-start',
        gap: gap ?? 0,
        flexDirection: flexDirection ?? 'row',
        width: isFull ? '100%' : 'auto',
      }}
      {...restProps}
    >
      {children}
    </div>
  );
};
