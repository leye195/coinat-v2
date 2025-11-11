import assert from "node:assert/strict";

import { __testing, readThroughCache } from "./cache";

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
