'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
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
