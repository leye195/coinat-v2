import React, { type PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';

type State = {
  hasError: boolean;
  error?: Error;
};

class ErrorBoundary extends React.Component<PropsWithChildren, State> {
  constructor(props: PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    const { children } = this.props;
    const { hasError, error } = this.state;

    if (hasError) {
      // You can render any custom fallback UI
      return (
        <div className={cn('flex flex-col items-center justify-center', 'p-6')}>
          <h1 className="text-[2rem] text-black">Something went wrong.</h1>
          <Button
            className={cn(
              'mt-4 bg-blue-600 border border-blue-600',
              'hover:bg-blue-700 active:bg-blue-700',
            )}
            onClick={() => window.location.reload()}
          >
            Reload
          </Button>
          {error && process.env.NODE_ENV === 'development' && (
            <div
              className={cn(
                'w-full max-w-[492px] mt-6',
                'bg-white text-xl rounded-lg shadow-[0_8px_24px_0_rgba(153,156,178,0.1)]',
              )}
            >
              <div
                className={cn(
                  'overflow-y-auto w-full min-h-[200px] max-h-[300px]',
                )}
              >
                <p className={cn('m-0 p-5 text-black')}>{error.stack}</p>
              </div>
            </div>
          )}
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
