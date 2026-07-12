'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Flex } from '@/components/ui/Flex';
import { useNewsData } from '@/hooks';
import MainNews from '../News/MainNews';
import SubNews from '../News/SubNews';

type NewsListProps = {
  category: string;
};

const STEP = 20;

function NewsList({ category }: NewsListProps) {
  const { data } = useNewsData({
    category,
  });

  const [visibleCount, setVisibleCount] = useState(STEP);

  const list = data?.list ?? [];
  const featuredList = data?.featured_list ?? [];
  const hasFeatured = featuredList.length > 0;

  const featured = (hasFeatured ? featuredList : list).slice(0, 2);
  const rest = hasFeatured ? list : list.slice(2);

  const onClickMore = () =>
    setVisibleCount((count) => Math.min(count + STEP, rest.length));

  if (list.length === 0) {
    return (
      <Flex
        className="min-h-[500px] bg-white px-3 py-6"
        isFull
        flexDirection="column"
        gap="12px"
      />
    );
  }

  return (
    <Flex
      className="min-h-[500px] bg-white px-3 py-6"
      isFull
      flexDirection="column"
      gap="12px"
    >
      <Flex className="max-md:!flex-col" gap="8px">
        {featured.map((news) => (
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
      <Flex className="flex-wrap" isFull gap="16px">
        {rest.slice(0, visibleCount).map((news) => (
          <SubNews key={news.id} data={news} />
        ))}
      </Flex>
      {rest.length > visibleCount && (
        <Button
          className="mt-2 self-center rounded border border-gray-200 px-6 hover:bg-gray-50"
          onClick={onClickMore}
          aria-label="뉴스 더보기"
        >
          더보기
        </Button>
      )}
    </Flex>
  );
}

export default NewsList;
