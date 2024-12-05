'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSetRecoilState } from 'recoil';
import { typeState } from '@/store/coin';

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setType = useSetRecoilState(typeState);

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;

    if (url.includes('type=BTC')) {
      setType('BTC');
    }

    if (!url || url === '/' || url.includes('?type=KRW')) {
      setType('KRW');
    }
  }, [pathname, searchParams, setType]);

  return null;
}
