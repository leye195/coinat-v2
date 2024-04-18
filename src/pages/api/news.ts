import { queryStringify } from '@/lib/utils';
import createHandler from '@/server/middleware';

const app = createHandler();

app.get(async (req, res) => {
  try {
    const { category = undefined } = req.query;
    console.log(
      category,
      ';:',
      queryStringify({
        category,
      }),
    );

    const response = await (
      await fetch(
        `https://api-manager.upbit.com/api/v1/coin_news?${queryStringify({
          category,
        })}`,
      )
    ).json();

    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
  }
});

export default app;
