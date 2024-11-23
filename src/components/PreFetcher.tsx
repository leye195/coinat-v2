'use client';

import { usePrefetch } from 'hooks/common';
import { getMarketcap } from '@/api';

function PreFetcher() {
  usePrefetch({
    queryKey: ['marketcap'],
    queryFn: getMarketcap,
  });

  return null;
}

export default PreFetcher;
