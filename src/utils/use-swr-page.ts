import useSWR, { Fetcher, Key, SWRConfiguration } from "swr";
import { useCallback } from "react";

export type SWRPage<K = any, V = any> = {
  page: number;
  size: number;
  pages: number;
  total: number;
  records: Map<K, V>;
};

const useSWRPage = <K = any, V = any, E = any>(
  key: Key,
  fetcher: Fetcher<SWRPage<K, V>>,
  options?: SWRConfiguration<SWRPage<K, V>, E>
) => {
  const query = useSWR<SWRPage<K, V>, E>(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    ...options,
  });

  const set = useCallback(
    async (key: K, value: (prev: V) => V) => {
      await query.mutate((prev) => {
        if (!prev) {
          return prev;
        }
        const clone = new Map(prev.records);
        const old = clone.get(key);
        if (old) {
          clone.set(key, value(old));
        }
        return {
          ...prev,
          records: clone,
        };
      }, false);
    },
    [query.mutate]
  );

  const keys = useCallback(
    () => [...(query.data?.records.keys() ?? [])],
    [query.data]
  );

  const values = useCallback(
    () => [...(query.data?.records.values() ?? [])],
    [query.data]
  );

  return {
    ...query,
    set,
    keys,
    values,
  };
};

export default useSWRPage;
