import assert from "node:assert/strict";

import { __testing, readThroughCache, refreshCache } from "./cache";
import { POST as revalidatePost } from "../cache/revalidate/route";
import {
  UPBIT_MARKET_CACHE_KEY,
  UPBIT_MARKET_DEFAULT_TTL_SECONDS,
} from "../upbit/market/route";

type AsyncTest = () => Promise<void> | void;

const tests: Array<{ name: string; fn: AsyncTest }> = [];

function test(name: string, fn: AsyncTest) {
  tests.push({ name, fn });
}

test("returns cached value on subsequent reads", async () => {
  __testing.clearMemoryCache();

  let callCount = 0;
  const fetcher = async () => {
    callCount += 1;
    return { payload: "first" };
  };

  const first = await readThroughCache({
    key: "test:memory",
    ttlSeconds: 120,
    fetcher,
  });

  const second = await readThroughCache({
    key: "test:memory",
    ttlSeconds: 120,
    fetcher,
  });

  assert.deepEqual(second, first);
  assert.equal(callCount, 1);
});

test("re-fetches value after TTL expiration", async () => {
  __testing.clearMemoryCache();

  let callCount = 0;
  const fetcher = async () => {
    callCount += 1;
    return `value-${callCount}`;
  };

  const ttlSeconds = 1;

  const first = await readThroughCache({
    key: "test:ttl",
    ttlSeconds,
    fetcher,
  });

  assert.equal(first, "value-1");

  await new Promise((resolve) => setTimeout(resolve, (ttlSeconds + 0.2) * 1000));

  const second = await readThroughCache({
    key: "test:ttl",
    ttlSeconds,
    fetcher,
  });

  assert.equal(second, "value-2");
  assert.equal(callCount, 2);
});

test("refreshCache bypasses stale memory entry", async () => {
  __testing.clearMemoryCache();

  let fetchCallCount = 0;
  const fetcher = async () => {
    fetchCallCount += 1;
    return { payload: `value-${fetchCallCount}` };
  };

  await readThroughCache({
    key: "test:refresh",
    ttlSeconds: 120,
    fetcher,
  });

  const refreshed = await refreshCache({
    key: "test:refresh",
    ttlSeconds: 120,
    fetcher,
  });

  assert.deepEqual(refreshed, { payload: "value-2" });

  let fallbackCalls = 0;
  const cached = await readThroughCache({
    key: "test:refresh",
    ttlSeconds: 120,
    fetcher: async () => {
      fallbackCalls += 1;
      return { payload: "from-fetch" };
    },
  });

  assert.deepEqual(cached, refreshed);
  assert.equal(fallbackCalls, 0);
});

test("revalidate API refreshes upbit market cache", async () => {
  __testing.clearMemoryCache();

  const originalFetch = globalThis.fetch;
  let upbitFetchCount = 0;

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : String(input);

    if (url === "https://api.upbit.com/v1/market/all?isDetails=true") {
      upbitFetchCount += 1;
      return new Response(
        JSON.stringify([{ market: "KRW-BTC", korean_name: "비트코인" }]),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    throw new Error(`Unexpected fetch call to ${url}`);
  }) as typeof fetch;

  process.env.MARKET_CACHE_REVALIDATE_TOKEN = "secret";

  try {
    const request = new Request("https://example.com/api/cache/revalidate", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-revalidate-token": "secret",
      },
      body: JSON.stringify({ target: "upbit-market" }),
    });

    const response = await revalidatePost(request);
    assert.equal(response.status, 200);

    const payload = (await response.json()) as {
      target: string;
      cacheKey: string;
      value: unknown;
    };

    assert.equal(payload.target, "upbit-market");
    assert.equal(payload.cacheKey, UPBIT_MARKET_CACHE_KEY);
    assert.ok(Array.isArray(payload.value));
    assert.equal(upbitFetchCount, 1);

    let fallbackCalls = 0;
    const cached = await readThroughCache({
      key: UPBIT_MARKET_CACHE_KEY,
      ttlSeconds: UPBIT_MARKET_DEFAULT_TTL_SECONDS,
      fetcher: async () => {
        fallbackCalls += 1;
        return [];
      },
    });

    assert.ok(Array.isArray(cached));
    assert.equal(fallbackCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
    delete process.env.MARKET_CACHE_REVALIDATE_TOKEN;
  }
});

test("revalidate API rejects missing token when required", async () => {
  __testing.clearMemoryCache();

  process.env.MARKET_CACHE_REVALIDATE_TOKEN = "secret";

  try {
    const request = new Request("https://example.com/api/cache/revalidate", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ target: "upbit-market" }),
    });

    const response = await revalidatePost(request);
    assert.equal(response.status, 401);
  } finally {
    delete process.env.MARKET_CACHE_REVALIDATE_TOKEN;
  }
});

(async function run() {
  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`✓ ${name}`);
    } catch (err) {
      console.error(`✗ ${name}`);
      console.error(err);
      process.exit(1);
    }
  }

  if (tests.length === 0) {
    console.warn("No tests were executed.");
    process.exit(1);
  }
})();
