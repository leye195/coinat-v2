import { readThroughCache } from "../../lib/cache";
import { FetchJsonError, fetchJson } from "../../lib/fetchJson";

const API_URL = "https://api.binance.com/api/v3/exchangeInfo";
const CACHE_KEY = "binance:market:exchange-info";
const DEFAULT_TTL_SECONDS = 600;

function resolveTtlSeconds(): number {
  const ttlFromEnv = Number(
    process.env.BINANCE_MARKET_CACHE_TTL ?? DEFAULT_TTL_SECONDS
  );
  if (Number.isFinite(ttlFromEnv) && ttlFromEnv > 0) {
    return Math.floor(ttlFromEnv);
  }
  return DEFAULT_TTL_SECONDS;
}

export const config = {
  api: {
    responseLimit: false,
  },
};

export async function GET() {
  try {
    const data = await readThroughCache({
      key: CACHE_KEY,
      ttlSeconds: resolveTtlSeconds(),
      fetcher: () => fetchJson(API_URL),
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
