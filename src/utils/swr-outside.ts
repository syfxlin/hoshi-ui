import React from "react";
import { useSWRConfig } from "swr";
import { InternalConfiguration } from "swr/dist/types";

// @ts-ignore
export const swr: InternalConfiguration = {};

export const SWROutside: React.FC = () => {
  const { cache, mutate } = useSWRConfig();

  swr.cache = cache;
  swr.mutate = mutate;

  return null;
};
