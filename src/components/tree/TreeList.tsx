import React, { forwardRef } from "react";
import Box from "../../components/layout/Box";
import { css } from "@emotion/react";
import { UIComponent } from "../../utils/types";

const TreeList: UIComponent<"div", any> = forwardRef((props, ref) => (
  <Box
    {...props}
    as="ul"
    ref={ref}
    css={css`
      list-style: none;
      padding-left: 0;
      flex-grow: 1;
      width: 100%;
    `}
  />
));

export default TreeList;
