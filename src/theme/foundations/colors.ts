import { baseColor } from "./base-color";

export type Colors = typeof baseColor & Record<string, string | string[]>;

export const colors: Colors = {
  ...baseColor,
};
