import axios from 'axios';
import createHandler from '@/server/middleware';

const API_URL = 'https://api-manager.upbit.com/api/v1/coin_info/pub/';

const app = createHandler();

app.get(async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      throw Error('');
    }

    const response = await axios.get(`${API_URL}${code}.json`);
    const { data } = response;

    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(400);
  }
});

export default app;
