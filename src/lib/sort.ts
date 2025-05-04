import sortBy from 'lodash.sortby';
import { CombinedTickers } from '@/store/socket';

export type Sort = 'last' | 'blast' | 'per' | 'symbol';

export const sortColumn = ['symbol', 'last', 'blast', 'per'];

export const initSort = {
  symbol: false,
  last: false,
  blast: false,
  per: false,
};

const sort = (data: CombinedTickers[], column: string, sortType: boolean) => {
  return sortType ? sortBy(data, column).reverse() : sortBy(data, column);
};

export default sort;
