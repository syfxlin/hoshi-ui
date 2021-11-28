import React, { forwardRef } from "react";
import { UIComponent } from "../utils/types";
import Box from "./layout/Box";
import { css } from "@emotion/react";
import { Text } from "@mantine/core";

const Ellipsis: UIComponent<typeof Text> = forwardRef((props, ref) => {
  return (
    <Box
      as={Text}
      {...props}
      ref={ref}
      css={css`
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      `}
    />
  );
});

export default Ellipsis;
