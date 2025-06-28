import { redirect } from 'next/navigation';
import Page from './components/Page';

export default async function ExchangePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] };
}) {
  const { code, type } = searchParams;

  if (!code || !type || Array.isArray(code) || Array.isArray(type)) {
    redirect('/');
  }

  return <Page code={code} type={type} />;
}
