import createHandler from '@/server/middleware';

const app = createHandler();

app.get((req, res) => {
  res.status(200).json({ name: 'John Doe' });
});

export default app;
