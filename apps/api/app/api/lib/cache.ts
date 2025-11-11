interface MemoryEntry<T> {
  value: T;
  expiresAt: number;
}

interface UpstashConfig {
  url: string;
  token: string;
}

interface UpstashPipelineResult {
  result?: string | null;
  error?: string;
}

export interface ReadThroughCacheOptions<T> {
  key: string;
  ttlSeconds: number;
  fetcher: () => Promise<T>;
}

const memoryCache = new Map<string, MemoryEntry<unknown>>();
let upstashConfigInitialized = false;
let upstashConfig: UpstashConfig | null = null;
let upstashErrorLogged = false;

function logUpstashError(err: unknown) {
  if (upstashErrorLogged) {
    return;
  }
  upstashErrorLogged = true;
  console.error("Redis cache error", err);
}

function getUpstashConfig(): UpstashConfig | null {
  if (upstashConfigInitialized) {
    return upstashConfig;
  }

  upstashConfigInitialized = true;

  const url =
    process.env.UPSTASH_REDIS_REST_URL ??
    process.env.REDIS_REST_URL ??
    process.env.REDIS_URL ??
    null;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.REDIS_REST_TOKEN ??
    process.env.REDIS_TOKEN ??
    null;

  if (!url || !token) {
    upstashConfig = null;
    return upstashConfig;
  }

  upstashConfig = {
    url: url.replace(/\/$/, ""),
    token,
  };

  return upstashConfig;
}

function getMemoryEntry<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) {
    return null;
  }

  if (entry.expiresAt <= Date.now()) {
    memoryCache.delete(key);
    return null;
  }

  return entry.value as T;
}

function setMemoryEntry<T>(key: string, value: T, ttlSeconds: number) {
  if (ttlSeconds <= 0) {
    memoryCache.delete(key);
    return;
  }

  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

async function upstashRequest(
  config: UpstashConfig,
  body: unknown
): Promise<UpstashPipelineResult[]> {
  try {
    const response = await fetch(`${config.url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Upstash request failed: ${response.status}`);
    }

    const data = (await response.json()) as UpstashPipelineResult[];
    return data;
  } catch (err) {
    logUpstashError(err);
    return [];
  }
}

async function upstashGet(key: string): Promise<string | null> {
  const config = getUpstashConfig();
  if (!config) {
    return null;
  }

  const [result] = await upstashRequest(config, [["GET", key]]);

  if (!result) {
    return null;
  }

  if (result.error) {
    logUpstashError(result.error);
    return null;
  }

  return result.result ?? null;
}

async function upstashSet(
  key: string,
  value: string,
  ttlSeconds: number
): Promise<void> {
  const config = getUpstashConfig();
  if (!config) {
    return;
  }

  if (ttlSeconds <= 0) {
    await upstashRequest(config, [["SET", key, value]]);
    return;
  }

  await upstashRequest(config, [["SETEX", key, String(ttlSeconds), value]]);
}

async function fetchAndPersist<T>(
  { key, ttlSeconds, fetcher }: ReadThroughCacheOptions<T>,
  persistToRedis: boolean
): Promise<T> {
  const freshValue = await fetcher();

  if (persistToRedis) {
    try {
      await upstashSet(key, JSON.stringify(freshValue), ttlSeconds);
    } catch (err) {
      logUpstashError(err);
    }
  }

  setMemoryEntry(key, freshValue, ttlSeconds);

  return freshValue;
}

export async function readThroughCache<T>(
  options: ReadThroughCacheOptions<T>
): Promise<T> {
  const { key, ttlSeconds } = options;

  const cachedValue = getMemoryEntry<T>(key);
  if (cachedValue !== null) {
    return cachedValue;
  }

  const hasRedis = getUpstashConfig() !== null;

  if (hasRedis) {
    const redisValue = await upstashGet(key);
    if (redisValue !== null) {
      try {
        const parsed = JSON.parse(redisValue) as T;
        setMemoryEntry(key, parsed, ttlSeconds);
        return parsed;
      } catch (err) {
        logUpstashError(err);
      }
    }
  }

  return fetchAndPersist(options, hasRedis);
}

export async function refreshCache<T>({
  key,
  ttlSeconds,
  fetcher,
}: ReadThroughCacheOptions<T>): Promise<T> {
  const hasRedis = getUpstashConfig() !== null;
  if (!hasRedis) {
    memoryCache.delete(key);
  }

  return fetchAndPersist({ key, ttlSeconds, fetcher }, hasRedis);
}

export const __testing = {
  clearMemoryCache: () => memoryCache.clear(),
  resetUpstashConfig: () => {
    upstashConfigInitialized = false;
    upstashConfig = null;
    upstashErrorLogged = false;
  },
};
