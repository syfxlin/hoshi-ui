import useSWR, { Fetcher, Key, SWRConfiguration } from "swr";
import { useCallback } from "react";

const useSWRMap = <K = any, V = any, E = any>(
  key: Key,
  fetcher: Fetcher<Map<K, V>>,
  options?: SWRConfiguration<Map<K, V>, E>
) => {
  const query = useSWR<Map<K, V>, E>(key, fetcher, options);

  const add = useCallback(
    async (key: K, value: V) => {
      await query.mutate((prev) => {
        const clone = new Map(prev ?? []);
        clone.set(key, value);
        return clone;
      });
    },
    [query.mutate]
  );
  const addAll = useCallback(
    async (entries?: [K, V][]) => {
      await query.mutate((prev) => {
        const clone = new Map(prev ?? []);
        entries?.forEach(([key, value]) => clone.set(key, value));
        return clone;
      });
    },
    [query.mutate]
  );

  const remove = useCallback(
    async (key: K) => {
      await query.mutate((prev) => {
        const clone = new Map(prev ?? []);
        clone.delete(key);
        return clone;
      });
    },
    [query.mutate]
  );
  const removeAll = useCallback(
    async (keys?: K[]) => {
      await query.mutate((prev) => {
        const clone = new Map(prev ?? []);
        keys?.forEach((key) => clone.delete(key));
        return clone;
      });
    },
    [query.mutate]
  );

  const set = useCallback(
    async (key: K, value: (prev: V) => V) => {
      await query.mutate((prev) => {
        const clone = new Map(prev ?? []);
        const old = clone.get(key);
        if (old) {
          clone.set(key, value(old));
        }
        return clone;
      });
    },
    [query.mutate]
  );

  return {
    ...query,
    add,
    addAll,
    remove,
    removeAll,
    set,
  };
};

export default useSWRMap;
