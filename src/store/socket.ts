import { atom } from 'recoil';

type ChatSocketState = {
  socket: any | null;
  isConnected: boolean;
};

export const chatSocketState = atom<ChatSocketState>({
  key: 'chatSocketState',
  default: {
    socket: null,
    isConnected: false,
  },
  dangerouslyAllowMutability: true,
});
