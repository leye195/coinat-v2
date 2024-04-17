import { Flex } from '../Flex';
import { News } from 'types/News';
import { Text } from '../Text';
import styled from '@emotion/styled';
import { relativeTime } from '@/lib/utils';
import { palette } from '@/styles/variables';
import { breakpoints } from '@/styles/mixin';

type SubNewsProps = {
  data: News;
};

const SubNews = ({ data }: SubNewsProps) => {
  return (
    <Container alignItems="center" justifyContent="space-between" gap="6px">
      <Title fontSize="12px" fontWeight={800}>
        {data.title}
      </Title>
      <Text fontSize="10px" color={palette.gray}>
        {relativeTime(data.created_at)}
      </Text>
    </Container>
  );
};

const Container = styled(Flex)`
  width: 49%;

  ${breakpoints.down('lg')} {
    width: 100%;
  }

  ${breakpoints.down('sm')} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled(Text)`
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export default SubNews;
