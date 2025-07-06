import createHandler from '@/server/middleware';

const app = createHandler();

app.get(async (_, res) => {
  try {
    const response = await fetch(
      'https://api.upbit.com/v1/market/all?isDetails=true',
    );
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
  }
});

export default app;
