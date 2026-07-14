import { Flex } from '@/components/ui/Flex';
import Skeleton from '@/components/ui/Skeleton';

export const CoinInfoSkeleton = () => {
  return (
    <Flex
      flexDirection="column"
      className="min-h-[550px] bg-surface px-3 py-5"
      gap="32px"
      isFull
    >
      <Flex flexDirection="column" gap="12px" isFull>
        <Skeleton width="100%" height={48} borderRadius="8px" />
        <Skeleton width="100%" height={140} borderRadius="8px" />
      </Flex>
      <Flex flexDirection="column" gap="20px">
        {[...Array(3)].map((_, idx) => (
          <Flex
            key={`coin-info-skeleton-${idx}`}
            flexDirection="column"
            gap="10px"
          >
            <Skeleton width="45%" height={22} borderRadius="6px" />
            <Skeleton width="100%" height={70} borderRadius="8px" />
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
