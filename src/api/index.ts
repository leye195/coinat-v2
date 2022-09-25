import axios, { AxiosResponse } from 'axios';
import type { Coin } from 'types/Coin';
import type { Currency } from 'types/Currency';

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: '/api/',
});

export const getCurrencyInfo = (): Promise<AxiosResponse<Currency>> =>
  api.get('currency');

export const getCoins = (type: 'KRW' | 'BTC'): Promise<AxiosResponse<Coin[]>> =>
  api.get(`coin?type=${type}`);
