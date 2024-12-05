'use client';

import { useInitCoinList } from 'hooks/queries';

const Worker = () => {
  useInitCoinList({ workerEnabled: true });
  return null;
};

export default Worker;
