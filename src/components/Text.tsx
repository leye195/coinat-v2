import type { CSSProperties, PropsWithChildren } from 'react';

type TextProps = {
  fontSize?: CSSProperties['fontSize'];
  fontWeight?: CSSProperties['fontWeight'];
  color?: CSSProperties['color'];
  className?: string;
} & PropsWithChildren;

export const Text = ({
  fontSize,
  fontWeight,
  color,
  children,
  className,
}: TextProps) => {
  return (
    <span
      className={className}
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
