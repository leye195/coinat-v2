import createHandler from '@/server/middleware';
import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';

const app = createHandler();

app.get(async (_, res) => {
  if (!res.socket.server.io) {
    console.log('connect socket server...');
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: '/api/chat/socketio',
    });

    res.socket.server.io = io;
  }

  res.end();
});

export default app;
