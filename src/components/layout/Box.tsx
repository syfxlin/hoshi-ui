import React, { forwardRef, PropsWithChildren } from "react";
import { css } from "@emotion/react";
import { UIComponent } from "../../utils/types";

export type BoxProps = PropsWithChildren<{}>;

const Box: UIComponent<"div", BoxProps> = forwardRef(
  ({ as, ...props }, ref) => {
    const As = as ?? "div";
    return (
      <As
        {...props}
        ref={ref}
        css={css`
          box-sizing: border-box;
        `}
      />
    );
  }
);

export default Box;
