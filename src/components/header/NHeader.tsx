import React from "react";
import { useTh } from "../../theme/hooks/use-th";
import Box from "../layout/Box";
import { css } from "@emotion/react";

const NHeader: React.FC = ({ children }) => {
  const th = useTh();
  return (
    <Box
      as="header"
      css={css`
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: ${th.spacing(4)};
        padding-right: ${th.spacing(4)};
      `}
    >
      {children}
    </Box>
  );
};

export default NHeader;
