import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from '@/components/shell/ThemeToggle';
import Text from '@/components/ui/Text';
import { cn } from '@/lib/utils';
import { palette } from '@/styles/variables';

const Header = () => {
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
                className="absolute w-auto -translate-y-8 translate-x-20"
                src="/assets/icons/coin.svg"
                alt="coin"
                width={14}
                height={14}
              />
            </div>
          </Link>
        </div>
        <div className={cn('flex items-center gap-3')}>
          <Link href="/watchlist">
            <Text fontSize="14px" color={palette.white}>
              관심종목
            </Text>
          </Link>
          <Link href="/trend">
            <Text fontSize="14px" color={palette.white}>
              코인동향
            </Text>
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
};

export default Header;
