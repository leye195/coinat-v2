import Layout from '@/components/Layout';
import { css } from '@emotion/react';
import type { NextPageWithLayout } from 'types/Page';

const Container = css`
  font-weight: 700;
`;

const Home: NextPageWithLayout = () => {
  return <div css={Container}>Main Page</div>;
};

Home.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default Home;
