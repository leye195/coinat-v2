import styled from '@emotion/styled';

import { breakpoint, flex } from '@/styles/mixin';
import type { NextPageWithLayout } from 'types/Page';

import Layout from '@/components/Layout';
import Table from '@/components/Table';
import { spacing } from '@/styles/variables';
import { setComma } from '@/lib/utils';

const Container = styled.div`
  font-weight: 700;

  ${breakpoint('md').down`
      color: red;
  `}
`;

const InfoTitle = styled.h6`
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
`;

const InfoValue = styled.p`
  margin: 0;
`;

const InfoCard = styled.div`
  ${flex({ direction: 'column' })};
  gap: ${spacing.xxs};
  width: 30%;
  padding: ${spacing.s};
  border: 1px solid #d0d0d0;
  border-radius: 16px;
  background-color: #000000cc;
  color: ${({ theme }) => theme.color.white};
`;

const InfoBox = styled.div`
  ${flex({})};
  gap: ${spacing.xs};
  margin: ${spacing.m} 0;
`;

const Home: NextPageWithLayout = () => {
  return (
    <Container>
      <InfoBox>
        <InfoCard>
          <InfoTitle>환율(USD/KRW)</InfoTitle>
          <InfoValue>{setComma(1422.937)}</InfoValue>
        </InfoCard>
        <InfoCard>
          <InfoTitle>환율(USDT/KRW)</InfoTitle>
          <InfoValue>{setComma(1422.937)}</InfoValue>
        </InfoCard>
        <InfoCard>
          <InfoTitle>업비트(BTC/KRW)</InfoTitle>
          <InfoValue>{setComma(26881645.21)}</InfoValue>
        </InfoCard>
        <InfoCard>
          <InfoTitle>바이낸스(BTC/KRW)</InfoTitle>
          <InfoValue>{setComma(26881645.21)}</InfoValue>
        </InfoCard>
      </InfoBox>
      <Table header={['코인', '업비트', '바이낸스', '차이(%)']}></Table>
    </Container>
  );
};

Home.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default Home;
