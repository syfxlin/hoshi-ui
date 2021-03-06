import useSWR, { Fetcher, Key, SWRConfiguration } from "swr";
import { useCallback } from "react";

const useSWRValue = <V = any, E = any>(
  key: Key,
  fetcher: Fetcher<V>,
  options?: SWRConfiguration<V, E>
) => {
  const query = useSWR<V, E>(key, fetcher, options);

  const set = useCallback(
    async (value: (prev: V) => V) => {
      await query.mutate((prev) => {
        if (prev) {
          return value(prev);
        }
      }, false);
    },
    [query.mutate]
  );

  return {
    ...query,
    set,
  };
};

export default useSWRValue;
