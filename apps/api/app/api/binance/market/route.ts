import { readThroughCache } from "../../lib/cache";
import { FetchJsonError, fetchJson } from "../../lib/fetchJson";

export const BINANCE_MARKET_API_URL =
  "https://api.binance.com/api/v3/exchangeInfo";
export const BINANCE_MARKET_CACHE_KEY = "binance:market:exchange-info";
export const BINANCE_MARKET_DEFAULT_TTL_SECONDS = 600;

export function resolveBinanceMarketTtlSeconds(): number {
  const ttlFromEnv = Number(
    process.env.BINANCE_MARKET_CACHE_TTL ?? BINANCE_MARKET_DEFAULT_TTL_SECONDS
  );
  if (Number.isFinite(ttlFromEnv) && ttlFromEnv > 0) {
    return Math.floor(ttlFromEnv);
  }
  return BINANCE_MARKET_DEFAULT_TTL_SECONDS;
}

export function fetchBinanceMarketMetadata() {
  return fetchJson(BINANCE_MARKET_API_URL);
}

export const config = {
  api: {
    responseLimit: false,
  },
};

export async function GET() {
  try {
    const data = await readThroughCache({
      key: BINANCE_MARKET_CACHE_KEY,
      ttlSeconds: resolveBinanceMarketTtlSeconds(),
      fetcher: fetchBinanceMarketMetadata,
    });

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("API Error:", err);
    const status = err instanceof FetchJsonError ? err.status : 400;
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}
