import { refreshCache } from "../../lib/cache";
import {
  BINANCE_MARKET_CACHE_KEY,
  BINANCE_MARKET_DEFAULT_TTL_SECONDS,
  fetchBinanceMarketMetadata,
  resolveBinanceMarketTtlSeconds,
} from "../../binance/market/route";
import {
  UPBIT_MARKET_CACHE_KEY,
  UPBIT_MARKET_DEFAULT_TTL_SECONDS,
  fetchUpbitMarketMetadata,
  resolveUpbitMarketTtlSeconds,
} from "../../upbit/market/route";

interface RevalidateRequestBody {
  target?: string;
}

type TargetKey = "upbit-market" | "binance-market";

interface RevalidateTargetConfig {
  cacheKey: string;
  resolveTtlSeconds: () => number;
  fallbackTtlSeconds: number;
  fetcher: () => Promise<unknown>;
}

const TARGETS: Record<TargetKey, RevalidateTargetConfig> = {
  "upbit-market": {
    cacheKey: UPBIT_MARKET_CACHE_KEY,
    resolveTtlSeconds: resolveUpbitMarketTtlSeconds,
    fallbackTtlSeconds: UPBIT_MARKET_DEFAULT_TTL_SECONDS,
    fetcher: fetchUpbitMarketMetadata,
  },
  "binance-market": {
    cacheKey: BINANCE_MARKET_CACHE_KEY,
    resolveTtlSeconds: resolveBinanceMarketTtlSeconds,
    fallbackTtlSeconds: BINANCE_MARKET_DEFAULT_TTL_SECONDS,
    fetcher: fetchBinanceMarketMetadata,
  },
};

function resolveTtl(target: RevalidateTargetConfig): number {
  const ttl = target.resolveTtlSeconds();
  if (Number.isFinite(ttl) && ttl > 0) {
    return Math.floor(ttl);
  }
  return target.fallbackTtlSeconds;
}

function resolveToken(request: Request): string | null {
  const headerToken = request.headers.get("x-revalidate-token");
  if (headerToken) {
    return headerToken;
  }

  try {
    const url = new URL(request.url);
    return url.searchParams.get("token");
  } catch (err) {
    console.error("Failed to parse revalidate request URL", err);
    return null;
  }
}

function unauthorizedResponse(): Response {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

function badRequest(message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  const requiredToken = process.env.MARKET_CACHE_REVALIDATE_TOKEN;

  if (requiredToken) {
    const providedToken = resolveToken(request);
    if (providedToken !== requiredToken) {
      return unauthorizedResponse();
    }
  }

  let body: RevalidateRequestBody | null = null;
  try {
    body = (await request.json()) as RevalidateRequestBody;
  } catch (err) {
    return badRequest("Invalid JSON payload");
  }

  const targetKey = body?.target as TargetKey | undefined;
  if (!targetKey) {
    return badRequest("Missing target field");
  }

  const target = TARGETS[targetKey];
  if (!target) {
    return badRequest(`Unsupported target: ${targetKey}`);
  }

  const ttlSeconds = resolveTtl(target);

  try {
    const value = await refreshCache({
      key: target.cacheKey,
      ttlSeconds,
      fetcher: target.fetcher,
    });

    return new Response(
      JSON.stringify({
        target: targetKey,
        cacheKey: target.cacheKey,
        ttlSeconds,
        refreshedAt: new Date().toISOString(),
        value,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Failed to refresh cache", err);
    return new Response(JSON.stringify({ error: "Failed to refresh cache" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
