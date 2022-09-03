import createHandler from '@/server/middleware';
import coinModel from '@/server/models/Coin';

const app = createHandler();

app.get(async (req, res) => {
  try {
    const { type = 'KRW' } = req.query;
    const coins = await coinModel
      .find({ [type as string]: true, upbit: true, binance: true })
      .sort({ name: 1 });

    return res.status(200).json(coins);
  } catch (err) {
    console.error(err);
  }
});

export default app;
