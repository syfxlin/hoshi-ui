import React from "react";
import { useTh } from "../../theme/hooks/use-th";
import Box from "../layout/Box";
import { css } from "@emotion/react";

type AppShellContainerProps = {
  header: React.ReactNode;
};

const AppShellContainer: React.FC<AppShellContainerProps> = ({
  header,
  children,
}) => {
  const th = useTh();
  return (
    <Box
      css={css`
        width: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
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
        {header}
      </Box>
      {children}
    </Box>
  );
};

export default AppShellContainer;
