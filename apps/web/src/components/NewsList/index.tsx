import { useNewsData } from '@/hooks';
import { Divider } from '../Divider';
import { Flex } from '../Flex';
import MainNews from '../News/MainNews';
import SubNews from '../News/SubNews';

type NewsListProps = {
  category: string;
};

const OFFSET = 2;

function NewsList({ category }: NewsListProps) {
  const { data } = useNewsData({
    category,
  });

  return (
    <Flex
      className="min-h-[500px] bg-white px-3 py-6"
      isFull
      flexDirection="column"
      gap="12px"
    >
      {data?.featured_list && data.featured_list.length > 0 && (
        <>
          <Flex className="max-md:!flex-col" gap="8px">
            {data?.featured_list.slice(OFFSET, OFFSET + 2).map((news) => (
              <MainNews key={news.id} data={news} />
            ))}
          </Flex>
          <Divider
            type="horizontal"
            size="1px"
            style={{
              width: '100%',
              marginBlock: '8px',
            }}
          />
        </>
      )}
      <Flex className="flex-wrap" isFull gap="16px">
        {data?.list.slice(OFFSET, OFFSET + 20).map((news) => (
          <SubNews key={news.id} data={news} />
        ))}
      </Flex>
    </Flex>
  );
}

export default NewsList;
