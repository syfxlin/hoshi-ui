import { css, keyframes } from "@emotion/react";
import { SerializedStyles } from "@emotion/serialize";

export type Animations = Record<string, SerializedStyles>;

export const spin = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const ping = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }

  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
`;

export const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }

  50% {
    opacity: .5;
  }
`;

export const bounce = keyframes`
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }

  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
`;

export const animations: Animations = {
  spin: css`
    ${spin} 1s linear infinite
  `,
  ping: css`
    ${ping} 1s cubic-bezier(0, 0, 0.2, 1) infinite
  `,
  pulse: css`
    ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite
  `,
  bounce: css`
    ${bounce} 1s infinite
  `,
};
