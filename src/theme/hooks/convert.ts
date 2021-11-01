import { MantineThemeOverride } from "@mantine/core";
import { Theme } from "@emotion/react";

export const convert = (theme: Theme): MantineThemeOverride => {
  return {
    colorScheme: theme.colorScheme,
    primaryColor: theme.primaryColor,
    white: theme.colors.white,
    black: theme.colors.black,
    colors: theme.colors as any,
    fontFamily: theme.fonts.sans,
    fontFamilyMonospace: theme.fonts.mono,
    lineHeight: theme.lineHeights.md,
    transitionTimingFunction: theme.timingFunctions.default,
    fontSizes: theme.fontSizes as any,
    radius: theme.radius as any,
    spacing: theme.spacing as any,
    breakpoints: theme.breakpoints as any,
    shadows: theme.shadows as any,
    headings: {
      fontFamily: theme.fonts.sans,
      sizes: {
        h1: {
          fontSize: theme.fontSizes.h1,
        },
        h2: {
          fontSize: theme.fontSizes.h2,
        },
        h3: {
          fontSize: theme.fontSizes.h3,
        },
        h4: {
          fontSize: theme.fontSizes.h4,
        },
        h5: {
          fontSize: theme.fontSizes.h5,
        },
        h6: {
          fontSize: theme.fontSizes.h6,
        },
      },
    },
  };
};
