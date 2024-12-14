import DailyVolumn from '@/components/DailyVolumn';
import Page from './components/Page';

export default async function TrendPage() {
  return (
    <Page
      dailyAskVolumn={<DailyVolumn orderBy="ask" count={10} />}
      dailyBidVolumn={<DailyVolumn orderBy="bid" count={10} />}
    />
  );
}
