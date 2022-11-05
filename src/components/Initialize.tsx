import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import SocketIOClient from 'socket.io-client';

import { chatSocketState } from 'store/socket';

const Initialize = () => {
  const setSocket = useSetRecoilState(chatSocketState);

  useEffect(() => {
    const socket = SocketIOClient({
      path: '/api/chat/socketio',
    });

    if (socket) {
      socket.on('connect', () => {
        console.log('socket connected', socket.id);
        setSocket({
          isConnected: true,
          socket,
        });
      });

      socket.on('connect_error', () => {
        setTimeout(() => {
          socket.connect();
        }, 1000);
      });

      return () => {
        setSocket({
          isConnected: true,
          socket: null,
        });
        socket.disconnect();
      };
    }
  }, [setSocket]);

  return <></>;
};

export default Initialize;
