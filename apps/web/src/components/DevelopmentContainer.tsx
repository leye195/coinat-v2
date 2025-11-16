import { ReactNode } from 'react';

interface DevelopmentContainerProps {
  children: ReactNode;
  fallback: ReactNode;
}

export default function DevelopmentContainer({
  children,
  fallback,
}: DevelopmentContainerProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return isDevelopment ? <>{fallback}</> : <>{children}</>;
}
