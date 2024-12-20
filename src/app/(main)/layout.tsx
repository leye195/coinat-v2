import { PropsWithChildren } from 'react';
import FearGreedServer from '@/components/FearGreed/FearGreed.server';
import ExchangeListServer from './components/ExchangeList/ExchangeList.server';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="font-bold">
      <FearGreedServer />
      <ExchangeListServer />
      {children}
    </div>
  );
}
