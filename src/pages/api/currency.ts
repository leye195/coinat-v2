import axios from 'axios';
import createHandler from '@/server/middleware';
import currencyModel from '@/server/models/Currency';

type Currency = {
  value: number;
  name: string;
};

const MEXC_API =
  'https://www.mexc.com/api/platform/common/currency/exchange/rate';

const app = createHandler();

app.get(async (_, res) => {
  try {
    const response = await axios.get(MEXC_API);

    if (response.status !== 200 || !response.data) {
      return res.status(response.status).json({ error: true });
    }

    const {
      data: { KRW },
    } = response.data;

    if (KRW) {
      await currencyModel.findOne(
        { name: 'KRW_USD' },
        (err: any, data: Currency) => {
          if (!err && data && data.value !== +KRW) {
            currencyModel.findOneAndUpdate(
              { name: 'KRW_USD' },
              {
                value: +KRW,
              },
            );
            return;
          }

          if (!data) {
            currencyModel.create({ name: 'KRW_USD', value: +KRW });
          }
        },
      );

      res.status(200).json({
        pair: 'KRW_USD',
        rate: +KRW,
      });
    }
  } catch (error) {
    const currency = await currencyModel.findOne({ name: 'KRW_USD' });
    res.status(200).json({
      name: 'KRW_USD',
      value: currency?.value,
    });
  }
});

export default app;
