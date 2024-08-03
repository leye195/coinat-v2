import type { CSSProperties, PropsWithChildren } from 'react';

type TextProps = {
  fontSize?: CSSProperties['fontSize'];
  fontWeight?: CSSProperties['fontWeight'];
  color?: CSSProperties['color'];
} & PropsWithChildren;

export const Text = ({ fontSize, fontWeight, color, children }: TextProps) => {
  return (
    <span
      style={{
        fontSize: fontSize ?? '16px',
        fontWeight: fontWeight ?? 400,
        color: color ?? 'black',
      }}
    >
      {children}
    </span>
  );
};
