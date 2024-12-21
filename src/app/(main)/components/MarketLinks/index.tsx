'use client';

import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { cn } from '@/lib/utils';
import { typeState } from '@/store/coin';

export default function MarketLinks() {
  const coinType = useRecoilValue(typeState);

  return (
    <>
      {coinType !== 'BTC' && (
        <div
          className={cn(
            'flex items-center text-center mb-0.5',
            'max-md:text-xs',
            'max-sm:text-[10px]',
          )}
        >
          <Link
            className={cn(
              'py-0.5 px-2  text-[#d0d0d0]',
              coinType === 'KRW' && 'text-[#f8b64c] ',
            )}
            href="/?type=KRW"
          >
            바이낸스 - BTC 마켓
          </Link>
          <Link
            className={cn(
              'p-0.5  text-[#d0d0d0]',
              coinType === 'USDT' && 'text-[#f8b64c]',
            )}
            href="/?type=USDT"
          >
            바이낸스 - USDT 마켓
          </Link>
        </div>
      )}
    </>
  );
}
