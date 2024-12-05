import createHandler from '@/server/middleware';

export const config = {
  api: {
    responseLimit: false,
  },
};

const app = createHandler();

app.get(async (_, res) => {
  try {
    const response = await fetch('https://api.binance.com/api/v3/exchangeInfo');
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
  }
});

export default app;
