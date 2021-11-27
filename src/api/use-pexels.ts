import { pexelsCurated, pexelsSearch, PhotoView } from "./pexels";
import useSWR from "swr";
import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";

export const usePexelsCurated = (page?: number, perPage?: number) => {
  return useSWR<PhotoView[]>(
    ["pexels/curated", page, perPage],
    async (key, page, perPage) => {
      const response = await pexelsCurated({ page, per_page: perPage });
      return response.data as PhotoView[];
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
    }
  );
};

export const usePexelsSearch = (page?: number, perPage?: number) => {
  const [search, setSearch] = useState("");
  const [debounced] = useDebouncedValue(search, 1000);

  const query = useSWR<PhotoView[] | null>(
    ["pexels/search", debounced, page, perPage],
    async (key, query, page, perPage) => {
      if (!query) {
        return null;
      }
      const response = await pexelsSearch({ query, page, per_page: perPage });
      return response.data as PhotoView[];
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
    }
  );

  return {
    ...query,
    search,
    setSearch,
    loading: () => query.data === undefined && !query.error,
  };
};
