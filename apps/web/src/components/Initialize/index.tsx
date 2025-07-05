import { getCoinsV2 } from '@/lib/coin';
import InitializeClient from './Client';

async function fetchData() {
  const krwData = await getCoinsV2('KRW');
  const btcData = await getCoinsV2('BTC');
  const usdtData = await getCoinsV2('USDT');

  return { krw: krwData, btc: btcData, usdt: usdtData };
}

async function Initialize() {
  const data = await fetchData();
  return <InitializeClient {...data} />;
}

export default Initialize;
