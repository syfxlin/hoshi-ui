import { CSSProperties } from "../types";

export type Sizes = {
  minor: number;
  major: number;
};

export const sizes: Sizes = {
  minor: 4,
  major: 8,
};

export type Spacing = {
  base: number;
  [key: string]: CSSProperties["margin"];
};

export const spacing: Spacing = {
  base: 4,
  xs: 4 * 2,
  sm: 4 * 3,
  md: 4 * 4,
  lg: 4 * 5,
  xl: 4 * 6,
};
