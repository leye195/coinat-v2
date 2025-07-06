export const TABLE_HEADERS = ['코인', '업비트', '바이낸스', '차이(%)'];

export const MARKET_SYMBOLS = {
  binance: {
    BTC: 'BTC',
    KRW: 'BTC',
    USDT: 'USDT',
  },
  upbit: {
    BTC: 'BTC',
    KRW: '₩',
    USDT: '₩',
  },
};

export const BINANCE_ICON = '/assets/icons/binance.svg';

export const MARKET_INFO = [
  {
    name: 'BTC 마켓',
    value: 'KRW',
    image: BINANCE_ICON,
  },
  {
    name: 'USDT 마켓',
    value: 'USDT',
    image: BINANCE_ICON,
  },
];
