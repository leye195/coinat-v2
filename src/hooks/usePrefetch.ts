import { useEffect } from 'react';
import { QueryFunction, QueryKey, useQueryClient } from 'react-query';

type UsePrefetchProps = {
  queryKey: QueryKey;
  queryFn: QueryFunction;
};

const usePrefetch = ({ queryKey, queryFn }: UsePrefetchProps) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const prefetch = async () => {
      await queryClient.prefetchQuery({
        queryKey,
        queryFn,
      });
    };
    prefetch();
  }, [queryClient, queryKey, queryFn]);
};

export default usePrefetch;
