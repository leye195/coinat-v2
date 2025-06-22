import Chart from './components/chart';
import { redirect } from 'next/navigation';

export default async function TradingViewPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] };
}) {
  const { code } = searchParams;

  if (!code || Array.isArray(code)) {
    redirect('/'); // Replace '/some-path' with your desired redirect URL
  }

  return <Chart code={code ?? 'ETH'} />;
}
