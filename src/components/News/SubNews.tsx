import styled from '@emotion/styled';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Text';
import { relativeTime } from '@/lib/utils';
import { breakpoints } from '@/styles/mixin';
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
    <Container
      alignItems="center"
      justifyContent="space-between"
      gap="6px"
      onClick={onClick}
    >
      <Title fontSize="12px" fontWeight={800}>
        {data.title}
      </Title>
      <Text fontSize="10px" color={palette.gray}>
        {relativeTime(data.created_at)}
      </Text>
    </Container>
  );
};

const Title = styled(Text)`
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Container = styled(Flex)`
  width: 49%;
  cursor: pointer;

  &:hover ${Title} {
    text-decoration: underline;
  }

  ${breakpoints.down('lg')} {
    width: 100%;
  }

  ${breakpoints.down('sm')} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export default SubNews;
