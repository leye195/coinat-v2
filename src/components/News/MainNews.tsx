import { Flex } from '@/components/Flex';
import Text from '@/components/Text';
import { cn, relativeTime } from '@/lib/utils';
import { palette } from '@/styles/variables';
import type { News } from '@/types/News';

type MainNewsProps = {
  data: News;
};

const MainNews = ({ data }: MainNewsProps) => {
  const onClick = () => {
    window.open(data.url);
  };

  return (
    <Flex className={cn('flex-1 cursor-pointer')} onClick={onClick}>
      <Flex flexDirection="column" gap="8px">
        <Text
          className="line-clamp-1 max-h-5 text-ellipsis break-all"
          fontSize="14px"
          fontWeight={800}
        >
          {data.title}
        </Text>
        <Text
          className="line-clamp-4 max-h-16 overflow-hidden text-ellipsis break-all leading-5"
          fontSize="12px"
        >
          {data.content.trim()}
        </Text>
        <Flex alignItems="center" gap="6px">
          <Text fontSize="10px" color={palette.gray}>
            {data.company}
          </Text>
          <Text fontSize="10px" color={palette.gray}>
            {relativeTime(data.created_at)}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MainNews;
