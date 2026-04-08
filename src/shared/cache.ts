import NodeCache from "node-cache";

const cache = new NodeCache({ useClones: false });

export function cacheGet<T>(key: string): T | undefined {
  return cache.get<T>(key);
}

export function cacheSet<T>(key: string, value: T, ttlSeconds: number): void {
  cache.set(key, value, ttlSeconds);
}

export function cacheKey(...parts: (string | number)[]): string {
  return parts.join("::");
}
