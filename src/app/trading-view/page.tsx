import { redirect } from 'next/navigation';
import Chart from './components/chart';

export default async function TradingViewPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] };
}) {
  const { code, type } = searchParams;

  if (!code || Array.isArray(code) || Array.isArray(type)) {
    redirect('/'); // Replace '/some-path' with your desired redirect URL
  }

  return <Chart code={code ?? 'ETH'} type={type ?? 'KRW'} />;
}
