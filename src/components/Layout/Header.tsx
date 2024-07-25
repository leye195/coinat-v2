import Image from 'next/image';
import Link from 'next/link';
import { getMarketcap } from '@/api';
import { Text } from '@/components/Text';
import usePrefetch from '@/hooks/usePrefetch';
import { cn } from '@/lib/utils';
import { palette } from '@/styles/variables';

const Header = () => {
  usePrefetch({
    queryKey: ['marketcap'],
    queryFn: getMarketcap,
  });

  return (
    <div
      className={cn(
        'flex items-center justify-between',
        'w-full h-12 bg-[#000000cc]',
        'max-md:h-9',
      )}
    >
      <nav
        className={cn(
          'flex items-center justify-between',
          'w-full h-full mx-auto p-3',
          'max-w-[1410px]',
        )}
      >
        <div>
          <Link href="/">
            <div
              className={cn(
                'relative text-white font-bold',
                'text-2xl max-md:text-base',
              )}
            >
              CoinAT
              <Image
                className="absolute translate-x-[5rem] translate-y-[-2rem]"
                src="/assets/icons/coin.svg"
                alt="coin"
                width={14}
                height={14}
              />
            </div>
          </Link>
        </div>
        <div>
          <Link href="/trend">
            <Text fontSize="14px" color={palette.white}>
              코인동향
            </Text>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Header;
