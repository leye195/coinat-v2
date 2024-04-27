import styled from '@emotion/styled';
import { spacing } from '@/styles/variables';
import Skeleton from '../Skeleton';

const Container = styled.div`
  width: 100%;
  margin-top: ${spacing.s};
  padding: ${spacing.xs};
  background-color: ${({ theme }) => theme.color.white};
`;

const TableSkeleton = () => {
  return (
    <Container>
      <Skeleton width="100%" height={52} borderRadius="8px" />
      <Skeleton
        width="100%"
        height={52}
        borderRadius="8px"
        marginTop="0.5rem"
      />
      <Skeleton
        width="100%"
        height={52}
        borderRadius="8px"
        marginTop="0.5rem"
      />
      <Skeleton
        width="100%"
        height={52}
        borderRadius="8px"
        marginTop="0.5rem"
      />
      <Skeleton
        width="100%"
        height={52}
        borderRadius="8px"
        marginTop="0.5rem"
      />
      <Skeleton
        width="100%"
        height={52}
        borderRadius="8px"
        marginTop="0.5rem"
      />
      <Skeleton
        width="100%"
        height={52}
        borderRadius="8px"
        marginTop="0.5rem"
      />
      <Skeleton
        width="100%"
        height={52}
        borderRadius="8px"
        marginTop="0.5rem"
      />
      <Skeleton
        width="100%"
        height={52}
        borderRadius="8px"
        marginTop="0.5rem"
      />
      <Skeleton
        width="100%"
        height={52}
        borderRadius="8px"
        marginTop="0.5rem"
      />
      <Skeleton
        width="100%"
        height={52}
        borderRadius="8px"
        marginTop="0.5rem"
      />
      <Skeleton
        width="100%"
        height={52}
        borderRadius="8px"
        marginTop="0.5rem"
      />
      <Skeleton
        width="100%"
        height={52}
        borderRadius="8px"
        marginTop="0.5rem"
      />
    </Container>
  );
};

export default TableSkeleton;
