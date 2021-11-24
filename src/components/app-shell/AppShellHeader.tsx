import React, { forwardRef } from "react";
import { UIComponent } from "../../utils/types";
import Box, { BoxProps } from "../layout/Box";
import { css } from "@emotion/react";
import { useTh } from "../../theme/hooks/use-th";

const AppShellHeader: UIComponent<"header", BoxProps> = forwardRef(
  (props, ref) => {
    const th = useTh();
    return (
      <Box
        {...props}
        as="header"
        ref={ref}
        css={css`
          height: 60px;
          flex: 0 0 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-left: ${th.spacing(4)};
          padding-right: ${th.spacing(4)};
          position: sticky;
          top: 0;
        `}
      />
    );
  }
);

export default AppShellHeader;
