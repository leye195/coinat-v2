import { readThroughCache } from "../../lib/cache";
import { FetchJsonError, fetchJson } from "../../lib/fetchJson";

export const UPBIT_MARKET_API_URL =
  "https://api.upbit.com/v1/market/all?isDetails=true";
export const UPBIT_MARKET_CACHE_KEY = "upbit:market:all";
export const UPBIT_MARKET_DEFAULT_TTL_SECONDS = 600;

export function resolveUpbitMarketTtlSeconds(): number {
  const ttlFromEnv = Number(
    process.env.UPBIT_MARKET_CACHE_TTL ?? UPBIT_MARKET_DEFAULT_TTL_SECONDS
  );
  if (Number.isFinite(ttlFromEnv) && ttlFromEnv > 0) {
    return Math.floor(ttlFromEnv);
  }
  return UPBIT_MARKET_DEFAULT_TTL_SECONDS;
}

export function fetchUpbitMarketMetadata() {
  return fetchJson(UPBIT_MARKET_API_URL);
}

export async function GET() {
  try {
    const data = await readThroughCache({
      key: UPBIT_MARKET_CACHE_KEY,
      ttlSeconds: resolveUpbitMarketTtlSeconds(),
      fetcher: fetchUpbitMarketMetadata,
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
