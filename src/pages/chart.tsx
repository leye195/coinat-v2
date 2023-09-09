import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/future/image';
import { Bounds } from '@visx/brush/lib/types';
import type { NextPageWithLayout } from 'types/Page';

import { getCSV } from 'api';
import { csvToJson } from '@/lib/utils';
import { flex } from '@/styles/mixin';
import { palette } from '@/styles/variables';
import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect';
import useMount from '@/hooks/useMount';

import BarChart from '@/components/Chart/Bar';
import Layout from '@/components/Layout';
import Candle from '@/components/Chart/Candle';
import BrushChart from '@/components/Chart/Brush';

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
  position: relative;
  ${flex({
    alignItems: 'center',
    justifyContents: 'flex-end',
    direction: 'column',
  })};
  gap: 0.5rem;
  padding-bottom: 1.25rem;
  width: inherit;
  min-height: 1020px;
  border-radius: 10px;
  background-color: ${palette.white};
`;

const Divider = styled.div`
  height: 3px;
  width: 100%;
  background-color: #d4d6dc;
`;

const ChartPage: NextPageWithLayout = () => {
  const router = useRouter();
  const isMounted = useMount();

  const [symbol, setSymbol] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [parentSize, setParentSize] = useState([0, 0]);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const handleResize = () => {
    const container = document.querySelector('.candle-container');

    if (!container) return;

    const { width, height } = container.getBoundingClientRect();
    setParentSize([width - 50, height]);
  };

  const handleBrushChange = (domain: Bounds | null) => {
    if (!domain) return;

    const { x0, x1, y0, y1 } = domain;
    const newData = data.filter((s) => {
      const x = new Date(s.date).getTime();
      const y = +s.close;
      return x > x0 && x < x1 && y > y0 && y < y1;
    });
    setFilteredData(newData);
  };

  useEffect(() => {
    if (isMounted) {
      const { symbol } = router.query;
      setSymbol(symbol as string);
    }
  }, [isMounted, router.query]);

  useIsomorphicLayoutEffect(() => {
    if (!symbol || !isMounted) return;

    (async () => {
      const { data } = await getCSV();
      const csv = csvToJson(await data.text());
      setData(csv);
      setFilteredData(csv);
    })();

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
        <Candle
          data={filteredData}
          width={parentSize[0]}
          height={parentSize[1] * 0.55}
        />
        <Divider />
        <BarChart
          data={filteredData}
          width={parentSize[0]}
          height={parentSize[1] / 4}
        />
        <BrushChart
          data={data}
          width={parentSize[0]}
          height={parentSize[1] / 8}
          handleBrushChange={handleBrushChange}
        />
      </ContentsBox>
    </Container>
  );
};

ChartPage.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default ChartPage;
