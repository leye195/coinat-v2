import styled from '@emotion/styled';

import { breakpoint } from '@/styles/mixin';
import type { NextPageWithLayout } from 'types/Page';

import Layout from '@/components/Layout';

const Container = styled.div`
  font-weight: 700;

  ${breakpoint('md').down`
      color: red;
  `}
`;

const Home: NextPageWithLayout = () => {
  return <Container>Main Page</Container>;
};

Home.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default Home;
