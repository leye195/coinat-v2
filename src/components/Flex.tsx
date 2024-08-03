import type { CSSProperties, PropsWithChildren } from 'react';

type FlexProps = {
  display?: 'flex' | 'inline-flex';
  alignItems?: CSSProperties['alignItems'];
  justifyContent?: CSSProperties['justifyContent'];
  gap?: string;
  flexDirection?: CSSProperties['flexDirection'];
  isFull?: boolean;
} & PropsWithChildren;

export const Flex = ({
  children,
  display,
  alignItems,
  justifyContent,
  gap,
  flexDirection,
  isFull,
}: FlexProps) => {
  return (
    <div
      style={{
        display: display ?? 'flex',
        alignItems: alignItems ?? 'flex-start',
        justifyContent: justifyContent ?? 'flex-start',
        gap: gap ?? 0,
        flexDirection: flexDirection ?? 'row',
        width: isFull ? '100%' : 'auto',
      }}
    >
      {children}
    </div>
  );
};
