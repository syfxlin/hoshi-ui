import React, { forwardRef } from "react";
import Box, { BoxProps } from "../layout/Box";
import { css } from "@emotion/react";
import { UIComponent } from "../../utils/types";

const AppShellContainer: UIComponent<"div", BoxProps> = forwardRef(
  ({ children }, ref) => {
    return (
      <Box
        ref={ref}
        css={css`
          width: 100%;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        `}
      >
        {children}
      </Box>
    );
  }
);

export default AppShellContainer;
