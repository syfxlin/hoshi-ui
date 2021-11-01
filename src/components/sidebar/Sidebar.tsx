import React from "react";
import { useTh } from "../../theme/hooks/use-th";
import Box from "../layout/Box";
import { css } from "@emotion/react";
import SidebarItem from "./SidebarItem";
import CollapseItem from "./CollapseItem";
import SidebarMenu from "./SidebarMenu";

type SidebarComponent = React.FC & {
  Item: typeof SidebarItem;
  Collapse: typeof CollapseItem;
  Menu: typeof SidebarMenu;
};

const Sidebar: SidebarComponent = ({ children }) => {
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

Sidebar.Item = SidebarItem;
Sidebar.Collapse = CollapseItem;
Sidebar.Menu = SidebarMenu;

export default Sidebar;
