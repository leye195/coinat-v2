import styled from '@emotion/styled';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Text';
import { relativeTime } from '@/lib/utils';
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
    <Container onClick={onClick}>
      <Flex flexDirection="column" gap="8px">
        <Title fontSize="14px" fontWeight={800}>
          {data.title}
        </Title>
        <Content fontSize="12px">{data.content.trim()}</Content>
        <Flex alignItems="center" gap="6px">
          <Text fontSize="10px" color={palette.gray}>
            {data.company}
          </Text>
          <Text fontSize="10px" color={palette.gray}>
            {relativeTime(data.created_at)}
          </Text>
        </Flex>
      </Flex>
    </Container>
  );
};

const Title = styled(Text)`
  display: -webkit-box;
  max-height: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  word-break: break-all;
`;

const Content = styled(Text)`
  display: -webkit-box;
  overflow: hidden;
  max-height: 75px;
  text-overflow: ellipsis;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  word-break: break-all;
  line-height: 20px;
`;

const Container = styled(Flex)`
  flex: 1;
  cursor: pointer;

  &:hover ${Title} {
    text-decoration: underline;
  }
`;

export default MainNews;
