import styled from '@emotion/styled';
import { useQuery } from 'react-query';

import { getFearGreedIndex } from '@/api';
import Skeleton from '@/components/Skeleton';
import { breakpoint } from '@/styles/mixin';
import { spacing } from '@/styles/variables';
import type { FearGreed } from '@/types/FearGreed';
import { fearGreedColor, fearGreedIndex } from 'data/fearGreed';

const FearGreedBlock = styled.section`
  padding: ${spacing.s};
  margin-top: ${spacing.xs};
  background-color: ${({ theme }) => theme.color.white};
  border: 1px solid #d0d0d0;
  font-weight: 600;

  ${breakpoint('md').down`
    padding: ${spacing.xs};
    margin-top: 0;
    font-size: 14px;
  `}

  ${breakpoint('sm').down`
    font-size: 11px;
   `}
`;

const FearGreedTitle = styled.span`
  font-weight: 400;
`;

const FearGreedValue = styled.span<{ color: string }>`
  margin-left: ${spacing.xs};
  color: ${({ color }) => color};
`;

const FearGreed = () => {
  const { isLoading, data } = useQuery(
    ['fear-greed'],
    async () => {
      const res = await getFearGreedIndex();
      const { data } = res.data;

      return data ? data[0] : {};
    },
    {
      refetchIntervalInBackground: true,
      refetchInterval: 1000 * 50,
    },
  );

  return (
    <FearGreedBlock>
      {isLoading ? (
        <Skeleton width="100%" height={20} borderRadius="4px" />
      ) : (
        <>
          <FearGreedTitle>공포 · 탐욕 지수 :</FearGreedTitle>
          <FearGreedValue
            color={fearGreedColor[data?.value_classification as FearGreed]}
          >
            {data?.value} -{' '}
            {fearGreedIndex[data?.value_classification as FearGreed]}
          </FearGreedValue>
        </>
      )}
    </FearGreedBlock>
  );
};

export default FearGreed;
