import { useEffect } from 'react';
import { QueryFunction, QueryKey, useQueryClient } from 'react-query';

type UsePrefetchProps = {
  queryKey: QueryKey;
  queryFn: QueryFunction;
};

const usePrefetch = ({ queryKey, queryFn }: UsePrefetchProps) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey,
      queryFn,
    });
  }, [queryClient, queryKey, queryFn]);
};

export default usePrefetch;
