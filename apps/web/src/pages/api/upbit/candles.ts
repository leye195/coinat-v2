import axios from 'axios';
import createHandler from '@/server/middleware';

const API_URL = 'https://api.upbit.com/v1/candles/';

const app = createHandler();

app.get(async (req, res) => {
  try {
    const { market, type = 'months', count = 200, minute = 3, to } = req.query;

    if (type === 'minutes') {
      const { data } = await axios.get(`${API_URL}minutes/${minute}`, {
        params: {
          market,
          count,
          to,
        },
      });
      return res.status(200).json(data);
    }

    const { data } = await axios.get(`${API_URL}${type}`, {
      params: {
        market,
        count,
        to,
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(400);
  }
});

export default app;
