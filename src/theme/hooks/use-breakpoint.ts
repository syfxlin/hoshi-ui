import { Breakpoints } from "../foundations/breakpoints";
import useMediaQuery from "./use-media-query";
import { useTheme } from "@emotion/react";

export const useUp = (minWidth: keyof Breakpoints) => {
  const theme = useTheme();
  return useMediaQuery(`(min-width: ${theme.breakpoints[minWidth]}px)`);
};

export const useDown = (maxWidth: keyof Breakpoints) => {
  const theme = useTheme();
  return useMediaQuery(`(max-width: ${theme.breakpoints[maxWidth]}px)`);
};

export const useBetween = (
  minWidth: keyof Breakpoints,
  maxWidth: keyof Breakpoints
) => {
  const theme = useTheme();
  return useMediaQuery(
    `(min-width: ${theme.breakpoints[minWidth]}px) and (max-width: ${theme.breakpoints[maxWidth]}px)`
  );
};
