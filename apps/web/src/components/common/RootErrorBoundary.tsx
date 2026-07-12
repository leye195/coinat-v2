import { ErrorInfo, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface GlobalErrorBoundaryProps {
  children: ReactNode;
  errorHandler: (error: Error, info: ErrorInfo) => void;
  FallbackComponent: ({ error }: { error: Error }) => JSX.Element;
}

export default function RootErrorBoundary({
  children,
  FallbackComponent,
  errorHandler,
}: GlobalErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={({ error }) => FallbackComponent({ error })}
      onError={errorHandler}
    >
      {children}
    </ErrorBoundary>
  );
}
