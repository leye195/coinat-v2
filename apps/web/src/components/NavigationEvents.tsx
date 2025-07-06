'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCoinStore } from '@/store/coin';

export function NavigationEvents() {
  const searchParams = useSearchParams();
  const { updateType } = useCoinStore();

  useEffect(() => {
    const type = searchParams?.get('type');

    if (type === 'BTC') {
      updateType('BTC');
    }

    if (type === 'USDT') {
      updateType('USDT');
    }

    if (!type || type === 'KRW') {
      updateType('KRW');
    }
  }, [searchParams, updateType]);

  return null;
}
