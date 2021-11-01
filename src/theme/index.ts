import { ThemeTokens } from "./types";
import {
  fonts,
  fontSizes,
  letterSpacings,
  lineHeights,
} from "./foundations/fonts";
import {
  transitions,
  transitionTimingFunctions,
} from "./foundations/transitions";
import { sizes, spacing } from "./foundations/sizes";
import { animations } from "./foundations/animations";
import { shadows } from "./foundations/shadows";
import { breakpoints } from "./foundations/breakpoints";
import { borderWidths, radius } from "./foundations/borders";
import { colors } from "./foundations/colors";

export const theme: ThemeTokens = {
  primaryColor: "blue",
  animations,
  borderWidths,
  radius,
  breakpoints,
  colors,
  fonts,
  fontSizes,
  letterSpacings,
  lineHeights,
  shadows,
  sizes,
  spacing,
  transitions,
  timingFunctions: transitionTimingFunctions,
};
