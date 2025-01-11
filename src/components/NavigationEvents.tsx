'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSetRecoilState } from 'recoil';
import { typeState } from '@/store/coin';

export function NavigationEvents() {
  const searchParams = useSearchParams();
  const setType = useSetRecoilState(typeState);

  useEffect(() => {
    const type = searchParams?.get('type');

    if (type === 'BTC') {
      setType('BTC');
    }

    if (type === 'USDT') {
      setType('USDT');
    }

    if (!type || type === 'KRW') {
      setType('KRW');
    }
  }, [searchParams, setType]);

  return null;
}
