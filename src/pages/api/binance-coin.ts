import createHandler from '@/server/middleware';

const app = createHandler();

app.get(async (req, res) => {
  try {
    const response = await fetch('https://api.binance.com/api/v3/exchangeInfo');
    const data = await response.json();
    const btcMarketSymbols = data.symbols
      .filter((data: any) => data.symbol.endsWith('BTC'))
      .map((data: any) => data.symbol.slice(0, data.symbol.length - 3));

    return res.status(200).json(btcMarketSymbols);
  } catch (err) {
    console.error(err);
  }
});

export default app;
