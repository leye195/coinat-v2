import { Flex } from '@/components/Flex';
import { Text } from '@/components/Text';
import { cn, relativeTime } from '@/lib/utils';

import { palette } from '@/styles/variables';
import type { News } from '@/types/News';

type SubNewsProps = {
  data: News;
};

const SubNews = ({ data }: SubNewsProps) => {
  const onClick = () => {
    window.open(data.url);
  };

  return (
    <Flex
      className={cn(
        'max-w-[49%] max-lg:max-w-full cursor-pointer',
        'max-sm:!flex-col max-sm:!items-start',
      )}
      isFull
      alignItems="center"
      justifyContent="space-between"
      gap="6px"
      onClick={onClick}
    >
      <Text
        className="max-w-[300px] overflow-hidden whitespace-nowrap text-ellipsis"
        fontSize="12px"
        fontWeight={800}
      >
        {data.title}
      </Text>
      <Text fontSize="10px" color={palette.gray}>
        {relativeTime(data.created_at)}
      </Text>
    </Flex>
  );
};

export default SubNews;
