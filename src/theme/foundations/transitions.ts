import { CSSProperties } from "../types";

export type Transitions = Record<string, CSSProperties["transition"]>;

export const transitions: Transitions = {};

export type TransitionTimingFunctions = {
  default: CSSProperties["transitionTimingFunction"];
  [key: string]: CSSProperties["transitionTimingFunction"];
};

export const transitionTimingFunctions: TransitionTimingFunctions = {
  default: "cubic-bezier(0.51, 0.3, 0, 1.21)",
  linear: "linear",
  in: "cubic-bezier(0.4, 0, 1, 1)",
  out: "cubic-bezier(0, 0, 0.2, 1)",
  inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
};
