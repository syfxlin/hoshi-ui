import useSWR, { Fetcher, Key, SWRConfiguration } from "swr";

const useSWRState = <D = any, E = any>(
  key: Key,
  fetcher: Fetcher<D>,
  options?: SWRConfiguration<D, E>
) => {
  const query = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    ...options,
  });

  const set = (value: D) => {
    query.mutate(value, false);
  };

  const update = (value: Partial<D>) => {
    query.mutate(
      (current) => ({
        ...(current as any),
        ...value,
      }),
      false
    );
  };

  return {
    ...query,
    set,
    update,
  };
};

export default useSWRState;
