import { Flex } from '@/components/Flex';
import { cn } from '@/lib/utils';

type Props = {
  name: React.ReactNode;
  width?: string;
  right?: JSX.Element | React.ReactNode;
  onClick?: () => void;
};

const Header = ({ name, width, right, onClick }: Props) => {
  return (
    <div
      className={cn(
        'flex items-center cursor-pointer',
        'px-2 py-3 font-normal w-[var(--width)]',
        'max-lg:text-[14px] max-md:text-[12px] max-sm:text-[10px]',
      )}
      style={{
        '--width': width ?? '25%',
      }}
      onClick={onClick}
    >
      {name}
      {right && (
        <Flex className={cn('ml-3 max-md:ml-2 max-sm:ml-1')}>{right}</Flex>
      )}
    </div>
  );
};

export default Header;
