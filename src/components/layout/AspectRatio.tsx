import React, { forwardRef } from "react";
import { css } from "@emotion/react";
import Box, { BoxProps } from "./Box";
import { Assign, UIComponent } from "../../utils/types";

export type AspectRatioProps = Assign<
  BoxProps,
  {
    ratio: number;
  }
>;

const AspectRatio: UIComponent<"div", AspectRatioProps> = forwardRef(
  ({ ratio, ...props }, ref) => {
    return (
      <Box
        {...props}
        ref={ref}
        css={css`
          position: relative;

          &::before {
            height: 0;
            content: "";
            display: block;
            padding-bottom: ${(1 / ratio) * 100}%;
          }

          & > *:not(style) {
            overflow: hidden;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
          }

          & > img,
          & > video {
            object-fit: cover;
          }
        `}
      />
    );
  }
);

export default AspectRatio;
