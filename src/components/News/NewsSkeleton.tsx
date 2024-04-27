import styled from '@emotion/styled';
import { Divider } from '@/components/Divider';
import { breakpoints } from '@/styles/mixin';
import { Flex } from '../Flex';
import Skeleton from '../Skeleton';

const NewsSkeleton = () => {
  return (
    <ContentBox flexDirection="column" gap="12px">
      <MainNewsBox gap="8px">
        <Container flexDirection="column" gap="8px">
          <Skeleton width="70%" height={16} />
          <Skeleton width="100%" height={60} />
          <Skeleton width={80} height={12} />
        </Container>
        <Container flexDirection="column" gap="8px">
          <Skeleton width="70%" height={16} />
          <Skeleton width="100%" height={60} />
          <Skeleton width={80} height={12} />
        </Container>
      </MainNewsBox>
      <Divider
        type="horizontal"
        size="1px"
        style={{
          width: '100%',
          marginBlock: '8px',
        }}
      />
      <SubNewsBox gap="16px">
        <SubNews alignItems="center" justifyContent="space-between" gap="6px">
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </SubNews>
        <SubNews alignItems="center" justifyContent="space-between" gap="6px">
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </SubNews>
        <SubNews alignItems="center" justifyContent="space-between" gap="6px">
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </SubNews>
        <SubNews alignItems="center" justifyContent="space-between" gap="6px">
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </SubNews>
        <SubNews alignItems="center" justifyContent="space-between" gap="6px">
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </SubNews>
        <SubNews alignItems="center" justifyContent="space-between" gap="6px">
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </SubNews>
        <SubNews alignItems="center" justifyContent="space-between" gap="6px">
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </SubNews>
        <SubNews alignItems="center" justifyContent="space-between" gap="6px">
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </SubNews>
        <SubNews alignItems="center" justifyContent="space-between" gap="6px">
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </SubNews>
        <SubNews alignItems="center" justifyContent="space-between" gap="6px">
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </SubNews>
        <SubNews alignItems="center" justifyContent="space-between" gap="6px">
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </SubNews>
        <SubNews alignItems="center" justifyContent="space-between" gap="6px">
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </SubNews>
        <SubNews alignItems="center" justifyContent="space-between" gap="6px">
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </SubNews>
        <SubNews alignItems="center" justifyContent="space-between" gap="6px">
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </SubNews>
        <SubNews alignItems="center" justifyContent="space-between" gap="6px">
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </SubNews>
        <SubNews alignItems="center" justifyContent="space-between" gap="6px">
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </SubNews>
        <SubNews alignItems="center" justifyContent="space-between" gap="6px">
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </SubNews>
        <SubNews alignItems="center" justifyContent="space-between" gap="6px">
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </SubNews>
        <SubNews alignItems="center" justifyContent="space-between" gap="6px">
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </SubNews>
        <SubNews alignItems="center" justifyContent="space-between" gap="6px">
          <Skeleton width="70%" height={14} />
          <Skeleton width="16px" height={12} />
        </SubNews>
      </SubNewsBox>
    </ContentBox>
  );
};

const ContentBox = styled(Flex)`
  padding: 24px 12px;
  background-color: white;
  min-height: 500px;
  width: 100%;
`;

const Container = styled(Flex)`
  flex: 1;
  width: 100%;
`;

const SubNews = styled(Flex)`
  width: 49%;

  ${breakpoints.down('lg')} {
    width: 100%;
  }

  ${breakpoints.down('sm')} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const MainNewsBox = styled(Flex)`
  width: 100%;

  ${breakpoints.down('md')} {
    flex-direction: column;
  }
`;

const SubNewsBox = styled(Flex)`
  flex-wrap: wrap;
  width: 100%;
`;

export default NewsSkeleton;
