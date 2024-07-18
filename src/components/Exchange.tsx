import Skeleton from '@/components/Skeleton';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  value: string | number;
  isLoading: boolean;
};

const Exchange = ({ title, value, isLoading }: Props) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 p-3',
        'w-1/5 border border-[#d0d0d0] rounded-2xl',
        'bg-white text-white whitespace-pre',
        'max-md:w-auto max-md:rounded-none max-md:border-none max-md:px-2 max-md:py-1',
      )}
    >
      <h6
        className={cn(
          'm-0 text-[14px] font-normal text-[#333333]',
          'max-md:text-[11px] max-md:w-min',
        )}
      >
        {title}
      </h6>
      {isLoading ? (
        <Skeleton width="100%" height={18} borderRadius="4px" />
      ) : (
        <p className={cn('m-0 text-black', 'max-md:text-[10px]')}>{value}</p>
      )}
    </div>
  );
};

export default Exchange;
