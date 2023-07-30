import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/future/image';
import type { NextPageWithLayout } from 'types/Page';

import data from 'data/candleData.json';
import { flex } from '@/styles/mixin';
import { palette } from '@/styles/variables';
import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect';
import useMount from '@/hooks/useMount';
import Layout from '@/components/Layout';
import CandleChart from '@/components/CandleChart';
import VolumnChart from '@/components/VolumnChart';

const Container = styled.div`
  ${flex({ direction: 'column' })};
  gap: 1rem;
  width: 100%;
  padding-top: 1rem;
`;

const TitleBox = styled.div`
  ${flex({ alignItems: 'center' })};
  gap: 0.5rem;
  width: inherit;
  padding: 0.5rem;
  background-color: ${palette.white};

  h1 {
    margin: 0;
    font-size: 24px;
  }
`;

const ContentsBox = styled.div`
  ${flex({
    alignItems: 'center',
    justifyContents: 'flex-end',
    direction: 'column',
  })};
  gap: 2.5rem;
  padding-bottom: 2rem;
  width: inherit;
  min-height: 1020px;
  background-color: ${palette.white};
`;

const Chart: NextPageWithLayout = () => {
  const router = useRouter();
  const isMounted = useMount();

  const [symbol, setSymbol] = useState<string | null>(null);
  const [parentSize, setParentSize] = useState([0, 0]);

  const handleResize = () => {
    const container = document.querySelector('.candle-container');

    if (!container) return;

    const { width, height } = container.getBoundingClientRect();
    setParentSize([width - 50, height]);
  };

  useEffect(() => {
    if (isMounted) {
      const { symbol } = router.query;
      setSymbol(symbol as string);
    }
  }, [isMounted, router.query]);

  useIsomorphicLayoutEffect(() => {
    if (!symbol || !isMounted) return;

    handleResize();
    window.addEventListener('resize', handleResize);
  }, [symbol, isMounted]);

  if (!symbol || !isMounted) return null;

  return (
    <Container>
      <TitleBox>
        <Image
          src={`https://static.upbit.com/logos/${symbol}.png`}
          alt={symbol}
          width={36}
          height={36}
        />
        <h1>{symbol}</h1>
      </TitleBox>
      <ContentsBox className="candle-container">
        {!!parentSize[0] && !!parentSize[1] && (
          <>
            <CandleChart
              width={parentSize[0]}
              height={parentSize[1] / 3}
              candles={data.slice(0, 50)}
            />
            <VolumnChart width={parentSize[0]} height={parentSize[1] / 3} />
          </>
        )}
      </ContentsBox>
    </Container>
  );
};

Chart.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default Chart;
