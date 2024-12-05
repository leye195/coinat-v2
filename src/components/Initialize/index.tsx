import { getCoinsV2 } from '@/lib/coin';
import InitializeClient from './Client';

async function fetchData() {
  const krwData = await getCoinsV2('KRW');
  const btcData = await getCoinsV2('BTC');

  return { krw: krwData, btc: btcData };
}

async function Initialize() {
  const data = await fetchData();
  return <InitializeClient {...data} />;
}

export default Initialize;
