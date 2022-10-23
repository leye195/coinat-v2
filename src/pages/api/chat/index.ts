import createHandler from '@/server/middleware';

const app = createHandler();

app.post(async (req, res) => {
  const message = req.body;
  res.socket.server.io.emit('message', message);

  res.status(201).json(message);
});

export default app;
