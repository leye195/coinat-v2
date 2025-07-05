import { type PropsWithChildren, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionWithTitleProps extends PropsWithChildren {
  title: ReactNode;
  className?: string;
}

export const SectionWithTitle = ({
  title,
  className,
  children,
}: SectionWithTitleProps) => {
  return (
    <section className={cn('flex flex-col', className)}>
      {title}
      {children}
    </section>
  );
};
