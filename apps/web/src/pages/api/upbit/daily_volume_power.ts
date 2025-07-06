import axios from 'axios';
import createHandler from '@/server/middleware';

const API_URL =
  'https://crix-api-cdn.upbit.com/v1/crix/trends/daily_volume_power';

const app = createHandler();

app.get(async (req, res) => {
  try {
    const { count = 220, code = 'KRW', orderBy } = req.query;
    const { data } = await axios.get(
      `${API_URL}?quoteCurrencyCode=${code}&count=${count}&orderBy=${orderBy}`,
    );

    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(400);
  }
});

export default app;
