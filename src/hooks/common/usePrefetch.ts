'use client';

import { QueryFunction, QueryKey, useQueryClient } from '@tanstack/react-query';

type UsePrefetchProps = {
  queryKey: QueryKey;
  queryFn: QueryFunction;
};

const usePrefetch = ({ queryKey, queryFn }: UsePrefetchProps) => {
  const queryClient = useQueryClient();
  queryClient.prefetchQuery({
    queryKey,
    queryFn,
  });
};

export default usePrefetch;
