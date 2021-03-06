import React, { forwardRef } from "react";
import { css } from "@emotion/react";
import Box, { BoxProps } from "./layout/Box";
import { UIComponent } from "../utils/types";

const Main: UIComponent<"main", BoxProps> = forwardRef(
  ({ children, ...props }, ref) => {
    return (
      <Box
        {...props}
        as="main"
        ref={ref}
        css={css`
          display: flex;
          flex-direction: column;
          flex: 1;
        `}
      >
        {children}
      </Box>
    );
  }
);

export default Main;
