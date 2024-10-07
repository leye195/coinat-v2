import { getCoins } from '@/lib/coin';

onmessage = async () => {
  try {
    const krwData = await getCoins('KRW');
    const btcData = await getCoins('BTC');

    postMessage({
      krw: krwData,
      btc: btcData,
    });
  } catch (error) {
    console.log(error);
    postMessage({
      krw: [],
      btc: [],
    });
  }
};