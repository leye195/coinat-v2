import { Divider } from '@/components/Divider';
import { Flex } from '@/components/Flex';
import Skeleton from '@/components/Skeleton';
import { cn } from '@/lib/utils';

const NewsSkeleton = () => {
  return (
    <Flex
      className="min-h-[500px] bg-white px-3 py-6"
      isFull
      flexDirection="column"
      gap="12px"
    >
      <Flex className="max-md:!flex-col" isFull gap="8px">
        <Flex className="flex-1" isFull flexDirection="column" gap="8px">
          <Skeleton width="70%" height={16} />
          <Skeleton width="100%" height={60} />
          <Skeleton width={80} height={12} />
        </Flex>
        <Flex className="flex-1" flexDirection="column" gap="8px">
          <Skeleton width="70%" height={16} />
          <Skeleton width="100%" height={60} />
          <Skeleton width={80} height={12} />
        </Flex>
      </Flex>
      <Divider
        type="horizontal"
        size="1px"
        style={{
          width: '100%',
          marginBlock: '8px',
        }}
      />
      <Flex className="flex-wrap" isFull gap="16px">
        <Flex
          className={cn(
            '!w-[49%] max-lg:!w-full max-sm:!flex-col max-sm:!items-start',
          )}
          alignItems="center"
          justifyContent="space-between"
          gap="6px"
        >
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </Flex>
        <Flex
          className={cn(
            '!w-[49%] max-lg:!w-full max-sm:!flex-col max-sm:!items-start',
          )}
          alignItems="center"
          justifyContent="space-between"
          gap="6px"
        >
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </Flex>
        <Flex
          className={cn(
            '!w-[49%] max-lg:!w-full max-sm:!flex-col max-sm:!items-start',
          )}
          alignItems="center"
          justifyContent="space-between"
          gap="6px"
        >
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </Flex>
        <Flex
          className={cn(
            '!w-[49%] max-lg:!w-full max-sm:!flex-col max-sm:!items-start',
          )}
          alignItems="center"
          justifyContent="space-between"
          gap="6px"
        >
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </Flex>
        <Flex
          className={cn(
            '!w-[49%] max-lg:!w-full max-sm:!flex-col max-sm:!items-start',
          )}
          alignItems="center"
          justifyContent="space-between"
          gap="6px"
        >
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </Flex>
        <Flex
          className={cn(
            '!w-[49%] max-lg:!w-full max-sm:!flex-col max-sm:!items-start',
          )}
          alignItems="center"
          justifyContent="space-between"
          gap="6px"
        >
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </Flex>
        <Flex
          className={cn(
            '!w-[49%] max-lg:!w-full max-sm:!flex-col max-sm:!items-start',
          )}
          alignItems="center"
          justifyContent="space-between"
          gap="6px"
        >
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </Flex>
        <Flex
          className={cn(
            '!w-[49%] max-lg:!w-full max-sm:!flex-col max-sm:!items-start',
          )}
          alignItems="center"
          justifyContent="space-between"
          gap="6px"
        >
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </Flex>
        <Flex
          className={cn(
            '!w-[49%] max-lg:!w-full max-sm:!flex-col max-sm:!items-start',
          )}
          alignItems="center"
          justifyContent="space-between"
          gap="6px"
        >
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </Flex>
        <Flex
          className={cn(
            '!w-[49%] max-lg:!w-full max-sm:!flex-col max-sm:!items-start',
          )}
          alignItems="center"
          justifyContent="space-between"
          gap="6px"
        >
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </Flex>
        <Flex
          className={cn(
            '!w-[49%] max-lg:!w-full max-sm:!flex-col max-sm:!items-start',
          )}
          alignItems="center"
          justifyContent="space-between"
          gap="6px"
        >
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </Flex>
        <Flex
          className={cn(
            '!w-[49%] max-lg:!w-full max-sm:!flex-col max-sm:!items-start',
          )}
          alignItems="center"
          justifyContent="space-between"
          gap="6px"
        >
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </Flex>
        <Flex
          className={cn(
            '!w-[49%] max-lg:!w-full max-sm:!flex-col max-sm:!items-start',
          )}
          alignItems="center"
          justifyContent="space-between"
          gap="6px"
        >
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </Flex>
        <Flex
          className={cn(
            '!w-[49%] max-lg:!w-full max-sm:!flex-col max-sm:!items-start',
          )}
          alignItems="center"
          justifyContent="space-between"
          gap="6px"
        >
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </Flex>
        <Flex
          className={cn(
            '!w-[49%] max-lg:!w-full max-sm:!flex-col max-sm:!items-start',
          )}
          alignItems="center"
          justifyContent="space-between"
          gap="6px"
        >
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </Flex>
        <Flex
          className={cn(
            '!w-[49%] max-lg:!w-full max-sm:!flex-col max-sm:!items-start',
          )}
          alignItems="center"
          justifyContent="space-between"
          gap="6px"
        >
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </Flex>
        <Flex
          className={cn(
            '!w-[49%] max-lg:!w-full max-sm:!flex-col max-sm:!items-start',
          )}
          alignItems="center"
          justifyContent="space-between"
          gap="6px"
        >
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </Flex>
        <Flex
          className={cn(
            '!w-[49%] max-lg:!w-full max-sm:!flex-col max-sm:!items-start',
          )}
          alignItems="center"
          justifyContent="space-between"
          gap="6px"
        >
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </Flex>
        <Flex
          className={cn(
            '!w-[49%] max-lg:!w-full max-sm:!flex-col max-sm:!items-start',
          )}
          alignItems="center"
          justifyContent="space-between"
          gap="6px"
        >
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </Flex>
        <Flex
          className={cn(
            '!w-[49%] max-lg:!w-full max-sm:!flex-col max-sm:!items-start',
          )}
          alignItems="center"
          justifyContent="space-between"
          gap="6px"
        >
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default NewsSkeleton;
