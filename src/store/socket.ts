import { atom } from 'recoil';
import { generateUid } from '@/lib/utils';

type ChatSocketState = {
  socket: any | null;
  isConnected: boolean;
};

export const chatSocketState = atom<ChatSocketState>({
  key: `chatSocketState/${generateUid()}`,
  default: {
    socket: null,
    isConnected: false,
  },
  dangerouslyAllowMutability: true,
});
