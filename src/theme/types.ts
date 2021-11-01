import { Properties } from "csstype";
import { Colors } from "./foundations/colors";
import { Animations } from "./foundations/animations";
import { BorderWidths, Radius } from "./foundations/borders";
import { Breakpoints } from "./foundations/breakpoints";
import {
  Fonts,
  FontSizes,
  LetterSpacings,
  LineHeights,
} from "./foundations/fonts";
import { Shadows } from "./foundations/shadows";
import { Sizes, Spacing } from "./foundations/sizes";
import {
  Transitions,
  TransitionTimingFunctions,
} from "./foundations/transitions";

export type CSSProperties = Properties<string | number>;

export type ThemeTokens = {
  primaryColor: keyof Colors;
  animations: Animations;
  borderWidths: BorderWidths;
  radius: Radius;
  breakpoints: Breakpoints;
  colors: Colors;
  fonts: Fonts;
  fontSizes: FontSizes;
  letterSpacings: LetterSpacings;
  lineHeights: LineHeights;
  shadows: Shadows;
  sizes: Sizes;
  spacing: Spacing;
  transitions: Transitions;
  timingFunctions: TransitionTimingFunctions;
};

export type ColorScheme = "light" | "dark";

declare module "@emotion/react" {
  export interface Theme extends ThemeTokens {
    colorScheme: ColorScheme;
  }
}
