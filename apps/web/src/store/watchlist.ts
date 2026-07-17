import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateUid, removeDuplicate } from '@/lib/utils';
import type { TickerType } from '@/types/Coin';

// zustand

export const MARKETS: TickerType[] = ['KRW', 'BTC', 'USDT'];

// Each market keeps its own watch list so KRW/BTC/USDT are managed separately.
export type MarketSymbols = Record<TickerType, string[]>;

export type WatchGroup = {
  id: string;
  name: string;
  markets: MarketSymbols;
};

export const DEFAULT_GROUP_ID = 'default';

const emptyMarkets = (): MarketSymbols => ({ KRW: [], BTC: [], USDT: [] });

type State = {
  groups: WatchGroup[];
  // Whether the one-time migration from the legacy krwfav/btcfav favorites has
  // already run. Kept in persisted state so the seed happens exactly once.
  seeded: boolean;
};

type Action = {
  createGroup: (name: string) => void;
  renameGroup: (id: string, name: string) => void;
  deleteGroup: (id: string) => void;
  addSymbol: (groupId: string, market: TickerType, symbol: string) => void;
  removeSymbol: (groupId: string, market: TickerType, symbol: string) => void;
  seedFromLegacy: (legacy: Partial<MarketSymbols>) => void;
};

const createDefaultGroup = (): WatchGroup => ({
  id: DEFAULT_GROUP_ID,
  name: '내 관심종목',
  markets: emptyMarkets(),
});

const mapGroup = (
  groups: WatchGroup[],
  id: string,
  fn: (group: WatchGroup) => WatchGroup,
) => groups.map((group) => (group.id === id ? fn(group) : group));

export const useWatchlistStore = create<State & Action>()(
  persist(
    (set) => ({
      groups: [createDefaultGroup()],
      seeded: false,
      createGroup: (name: string) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        set((state) => ({
          groups: [
            ...state.groups,
            { id: generateUid(), name: trimmed, markets: emptyMarkets() },
          ],
        }));
      },
      renameGroup: (id: string, name: string) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        set((state) => ({
          groups: mapGroup(state.groups, id, (group) => ({
            ...group,
            name: trimmed,
          })),
        }));
      },
      deleteGroup: (id: string) => {
        set((state) => {
          // Keep at least one group so the page always has something to render.
          if (state.groups.length <= 1) return state;
          return { groups: state.groups.filter((group) => group.id !== id) };
        });
      },
      addSymbol: (groupId: string, market: TickerType, symbol: string) => {
        set((state) => ({
          groups: mapGroup(state.groups, groupId, (group) => ({
            ...group,
            markets: {
              ...group.markets,
              [market]: removeDuplicate([...group.markets[market], symbol]),
            },
          })),
        }));
      },
      removeSymbol: (groupId: string, market: TickerType, symbol: string) => {
        set((state) => ({
          groups: mapGroup(state.groups, groupId, (group) => ({
            ...group,
            markets: {
              ...group.markets,
              [market]: group.markets[market].filter((s) => s !== symbol),
            },
          })),
        }));
      },
      seedFromLegacy: (legacy: Partial<MarketSymbols>) => {
        set((state) => {
          if (state.seeded) return state;
          return {
            seeded: true,
            groups: mapGroup(state.groups, DEFAULT_GROUP_ID, (group) => ({
              ...group,
              markets: {
                KRW: removeDuplicate([
                  ...group.markets.KRW,
                  ...(legacy.KRW ?? []),
                ]),
                BTC: removeDuplicate([
                  ...group.markets.BTC,
                  ...(legacy.BTC ?? []),
                ]),
                USDT: removeDuplicate([
                  ...group.markets.USDT,
                  ...(legacy.USDT ?? []),
                ]),
              },
            })),
          };
        });
      },
    }),
    {
      name: 'watchlist',
      version: 1,
      // v0 stored a single shared `symbols` list per group; move it under KRW.
      migrate: (persisted: any, version: number) => {
        if (version < 1 && persisted?.groups) {
          persisted.groups = persisted.groups.map((group: any) => ({
            id: group.id,
            name: group.name,
            markets: {
              KRW: group.symbols ?? [],
              BTC: [],
              USDT: [],
            },
          }));
        }
        return persisted as State;
      },
      partialize: (state) => ({ groups: state.groups, seeded: state.seeded }),
    },
  ),
);
