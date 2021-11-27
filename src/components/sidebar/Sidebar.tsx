import React, { forwardRef } from "react";
import { useTh } from "../../theme/hooks/use-th";
import Box, { BoxProps } from "../layout/Box";
import { css } from "@emotion/react";
import { UIComponent } from "../../utils/types";

const Sidebar: UIComponent<"div", BoxProps> = forwardRef((props, ref) => {
  const th = useTh();
  return (
    <Box
      {...props}
      ref={ref}
      css={css`
        display: flex;
        flex-direction: column;
        width: 100%;
        flex-grow: 1;
        background-color: ${th.color("gray.1", "dark.5")};
      `}
    />
  );
});

export default Sidebar;
