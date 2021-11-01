import React from "react";
import { useTh } from "../../theme/hooks/use-th";
import Box from "../layout/Box";
import { css } from "@emotion/react";

const Sidebar: React.FC = ({ children }) => {
  const th = useTh();
  return (
    <Box
      css={css`
        display: flex;
        flex-direction: column;
        width: 100%;
        flex-grow: 1;
        background-color: ${th.color("gray.1", "gray.9")};
      `}
    >
      {children}
    </Box>
  );
};

export default Sidebar;
