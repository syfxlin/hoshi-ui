import { css, Theme, useTheme } from "@emotion/react";
import { Fonts } from "../foundations/fonts";
import { Breakpoints } from "../foundations/breakpoints";
import { Sizes } from "../foundations/sizes";

type PropsWithTheme = object & { theme: Theme };

type ColorParam = string | [string, (v: string) => string];

type SizesParam = {
  base: number;
  [key: string]: any;
};

const parseColor = (c: ColorParam, theme: Theme): string => {
  if (typeof c === "string") {
    c = [c, (v) => v];
  }
  const [color, convert] = c;
  const [name, level] = color.split(".");
  if (level === undefined) {
    return theme.colors[name] as string;
  }
  return convert(
    theme.colors[name === "primary" ? theme.primaryColor : name][
      parseInt(level)
    ]
  );
};

const parseSize = (size: string | number, sizes: SizesParam) => {
  if (typeof size === "number") {
    return `${size * sizes.base}px`;
  } else {
    const s = sizes[size] ?? size;
    return typeof s === "number" ? `${s}px` : s;
  }
};

export const th = {
  color:
    (color: ColorParam, dark?: ColorParam) =>
    ({ theme }: PropsWithTheme) => {
      return theme.colorScheme === "light"
        ? parseColor(color, theme)
        : parseColor(dark ?? color, theme);
    },
  animation:
    (animation: string) =>
    ({ theme }: PropsWithTheme) => {
      return theme.animations[animation] ?? animation;
    },
  borderWidth:
    (size: string | number) =>
    ({ theme }: PropsWithTheme) => {
      return parseSize(size, theme.borderWidths);
    },
  radius:
    (size: string | number) =>
    ({ theme }: PropsWithTheme) => {
      return parseSize(size, theme.radius);
    },
  breakpoint:
    (size: keyof Breakpoints) =>
    ({ theme }: PropsWithTheme) => {
      return `${theme.breakpoints[size]}px`;
    },
  font:
    (font: keyof Fonts) =>
    ({ theme }: PropsWithTheme) => {
      return theme.fonts[font] ?? font;
    },
  fontSize:
    (size: string | number) =>
    ({ theme }: PropsWithTheme) => {
      return parseSize(size, theme.fontSizes);
    },
  letterSpacing:
    (size: string | number) =>
    ({ theme }: PropsWithTheme) => {
      return parseSize(size, theme.letterSpacings);
    },
  lineHeight:
    (size: string | number) =>
    ({ theme }: PropsWithTheme) => {
      if (typeof size === "number") {
        return theme.lineHeights.base * size;
      }
      return theme.lineHeights[size] ?? size;
    },
  shadow:
    (shadow: string) =>
    ({ theme }: PropsWithTheme) => {
      return theme.shadows[shadow] ?? shadow;
    },
  size:
    (size: number | [keyof Sizes, number]) =>
    ({ theme }: PropsWithTheme) => {
      if (typeof size === "number") {
        return `${theme.sizes.minor * size}px`;
      } else {
        return `${theme.sizes[size[0]] * size[1]}px`;
      }
    },
  spacing:
    (size: string | number) =>
    ({ theme }: PropsWithTheme) => {
      return parseSize(size, theme.spacing);
    },
  transition:
    (transition: string) =>
    ({ theme }: PropsWithTheme) => {
      return theme.transitions[transition] ?? transition;
    },
  timingFunction:
    (fun: string) =>
    ({ theme }: PropsWithTheme) => {
      return theme.timingFunctions[fun] ?? fun;
    },
  // responsive
  up:
    (minWidth: keyof Breakpoints) =>
    ({ theme }: PropsWithTheme) => {
      return `@media (min-width: ${theme.breakpoints[minWidth]}px)`;
    },
  down:
    (maxWidth: keyof Breakpoints) =>
    ({ theme }: PropsWithTheme) => {
      return `@media (max-width: ${theme.breakpoints[maxWidth]}px)`;
    },
  between:
    (minWidth: keyof Breakpoints, maxWidth: keyof Breakpoints) =>
    ({ theme }: PropsWithTheme) => {
      return `@media (min-width: ${theme.breakpoints[minWidth]}px) and (max-width: ${theme.breakpoints[maxWidth]}px)`;
    },
  responsive:
    (values: Partial<Record<keyof Breakpoints | "_", any>>) =>
    ({ theme }: PropsWithTheme) => {
      return Object.entries(values).map(([bp, style]) => {
        if (bp === "_") {
          return style;
        } else {
          return css`
            @media (min-width: ${theme.breakpoints[
                bp as keyof Breakpoints
              ]}px) {
              ${style}
            }
          `;
        }
      });
    },
};

export const useTh = () => {
  const theme = useTheme();
  const props = { theme };
  return {
    theme,
    colorScheme: theme.colorScheme,
    primaryColor: theme.primaryColor,
    color: (color: ColorParam, dark?: ColorParam) =>
      th.color(color, dark)(props),
    animation: (animation: string) => th.animation(animation)(props),
    borderWidth: (size: string | number) => th.borderWidth(size)(props),
    radius: (size: string | number) => th.radius(size)(props),
    breakpoint: (size: keyof Breakpoints) => th.breakpoint(size)(props),
    font: (font: keyof Fonts) => th.font(font)(props),
    fontSize: (size: string | number) => th.fontSize(size)(props),
    letterSpacing: (size: string | number) => th.letterSpacing(size)(props),
    lineHeight: (size: string | number) => th.lineHeight(size)(props),
    shadow: (shadow: string) => th.shadow(shadow)(props),
    size: (size: number | [keyof Sizes, number]) => th.size(size)(props),
    spacing: (size: string | number) => th.spacing(size)(props),
    transition: (transition: string) => th.transition(transition)(props),
    timingFunction: (fun: string) => th.timingFunction(fun)(props),
    // responsive
    up: (minWidth: keyof Breakpoints) => th.up(minWidth)(props),
    down: (maxWidth: keyof Breakpoints) => th.down(maxWidth)(props),
    between: (minWidth: keyof Breakpoints, maxWidth: keyof Breakpoints) =>
      th.between(minWidth, maxWidth)(props),
    responsive: (values: Partial<Record<keyof Breakpoints | "_", any>>) =>
      th.responsive(values)(props),
  };
};
