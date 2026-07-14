import { PropsWithChildren } from 'react';
import { Flex } from '@/components/ui/Flex';
import Skeleton from '@/components/ui/Skeleton';

interface LoadingProps extends PropsWithChildren {
  isLoading: boolean;
}

export default function Loading({ isLoading, children }: LoadingProps) {
  if (isLoading) {
    return (
      <Flex isFull className="bg-surface p-[4px]">
        <Skeleton width="100%" height="300px" />
      </Flex>
    );
  }

  return children;
}
