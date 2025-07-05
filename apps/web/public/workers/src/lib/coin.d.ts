import type { Coin } from '@/types/Coin';
type Currency = 'KRW' | 'BTC' | 'USDT';
export declare const getCoinSymbolImage: (symbol: string) => string;
export declare const getCoinsV2: (type: Currency) => Promise<Coin[]>;
export declare const getCoins: (type: Currency) => Promise<Coin[]>;
export {};
//# sourceMappingURL=coin.d.ts.map