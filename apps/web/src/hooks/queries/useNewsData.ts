'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { getNews } from '@/api';
import type { NewsResponse } from '@/types/News';

type UseNewsDataProps = {
  category: string;
};

const useNewsData = ({ category }: UseNewsDataProps) => {
  return useSuspenseQuery({
    queryKey: ['news', category],
    queryFn: ({ queryKey }) =>
      getNews(queryKey[1] === 'all' ? undefined : queryKey[1]),
    select: (response) => {
      const { data } = response.data;
      return data as NewsResponse;
    },
  });
};

export default useNewsData;
