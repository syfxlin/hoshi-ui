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

  const setState = (value: D) => {
    query.mutate(value, false);
  };

  return {
    ...query,
    setState,
  };
};

export default useSWRState;
