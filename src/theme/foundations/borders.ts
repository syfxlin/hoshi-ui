import { CSSProperties } from "../types";

export type BorderWidths = {
  base: number;
  xs: CSSProperties["borderWidth"];
  sm: CSSProperties["borderWidth"];
  md: CSSProperties["borderWidth"];
  lg: CSSProperties["borderWidth"];
  xl: CSSProperties["borderWidth"];
  [key: string]: CSSProperties["borderWidth"];
};

export const borderWidths: BorderWidths = {
  base: 1,
  xs: 0,
  sm: 0.5,
  md: 1,
  lg: 2,
  xl: 4,
};

export type Radius = {
  base: number;
  xs: CSSProperties["borderRadius"];
  sm: CSSProperties["borderRadius"];
  md: CSSProperties["borderRadius"];
  lg: CSSProperties["borderRadius"];
  xl: CSSProperties["borderRadius"];
  half: CSSProperties["borderRadius"];
  full: CSSProperties["borderRadius"];
  [key: string]: CSSProperties["borderRadius"];
};

export const radius: Radius = {
  base: 4,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 32,
  half: "50%",
  full: 9999,
};
