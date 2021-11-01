import { CSSProperties } from "../types";

export type Fonts = {
  sans: CSSProperties["fontFamily"];
  mono: CSSProperties["fontFamily"];
  serif: CSSProperties["fontFamily"];
};

export const fonts: Fonts = {
  sans: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
  mono: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
  serif: `Georgia, Cambria, "Times New Roman", Times, serif`,
};

export type FontSizes = {
  base: number;
  xs: CSSProperties["fontSize"];
  sm: CSSProperties["fontSize"];
  md: CSSProperties["fontSize"];
  lg: CSSProperties["fontSize"];
  xl: CSSProperties["fontSize"];
  h1: CSSProperties["fontSize"];
  h2: CSSProperties["fontSize"];
  h3: CSSProperties["fontSize"];
  h4: CSSProperties["fontSize"];
  h5: CSSProperties["fontSize"];
  h6: CSSProperties["fontSize"];
  [key: string]: CSSProperties["fontSize"];
};

export const fontSizes: FontSizes = {
  base: 16,
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  h1: 34,
  h2: 26,
  h3: 22,
  h4: 18,
  h5: 16,
  h6: 14,
};

export type LetterSpacings = {
  base: number;
  xs: CSSProperties["letterSpacing"];
  sm: CSSProperties["letterSpacing"];
  md: CSSProperties["letterSpacing"];
  lg: CSSProperties["letterSpacing"];
  xl: CSSProperties["letterSpacing"];
  [key: string]: CSSProperties["letterSpacing"];
};

export const letterSpacings: LetterSpacings = {
  base: 0.9,
  xs: -0.9,
  sm: 0,
  md: 0.9,
  lg: 1.8,
  xl: 3.6,
};

export type LineHeights = {
  base: number;
  xs: CSSProperties["lineHeight"];
  sm: CSSProperties["lineHeight"];
  md: CSSProperties["lineHeight"];
  lg: CSSProperties["lineHeight"];
  xl: CSSProperties["lineHeight"];
  [key: string]: CSSProperties["lineHeight"];
};

export const lineHeights: LineHeights = {
  base: 1.5,
  xs: 1,
  sm: 1.25,
  md: 1.5,
  lg: 1.75,
  xl: 2,
};
