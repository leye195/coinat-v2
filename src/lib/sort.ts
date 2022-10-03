import sortBy from 'lodash/sortBy';
import type { CombinedTickers } from './socket';

export type Sort = 'last' | 'blast' | 'per' | 'symbol';

export const sortColumn = ['symbol', 'last', 'blast', 'per'];

export const initSort = {
  symbol: false,
  last: false,
  blast: false,
  per: false,
};

export default (data: CombinedTickers[], column: string, sortType: boolean) => {
  return sortType ? sortBy(data, column).reverse() : sortBy(data, column);
};
