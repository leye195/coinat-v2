import axios from 'axios';
import createHandler from '@/server/middleware';
import currencyModel from '@/server/models/Currency';
import type { Currency } from '@/types/Currency';

const RATE_API =
  'https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD';
//'https://www.mexc.com/api/platform/common/currency/exchange/rate';

const app = createHandler();

app.get(async (_, res) => {
  try {
    const response = await axios.get(RATE_API);

    if (response.status !== 200 || !response.data) {
      return res.status(response.status).json({ error: true });
    }

    const { data } = response;
    const [{ basePrice: KRW }] = data;

    if (KRW) {
      await currencyModel.findOneAndUpdate(
        { name: 'KRW_USD' },
        (err: any, data: Currency) => {
          if (!err && data && data.value !== +KRW) {
            currencyModel.updateOne(
              { name: 'KRW_USD' },
              {
                value: +KRW,
              },
            );
          }

          if (!data) {
            currencyModel.create({ name: 'KRW_USD', value: +KRW });
          }
        },
      );

      res.status(200).json({
        pair: 'KRW_USD',
        value: +KRW,
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
