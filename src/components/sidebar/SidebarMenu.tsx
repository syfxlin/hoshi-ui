import React from "react";
import { Menu, MenuProps } from "@mantine/core";
import { css } from "@emotion/react";
import SidebarControl from "./SidebarControl";

const SidebarMenu: React.FC<MenuProps> = ({ children, ...props }) => {
  return (
    <Menu
      withArrow
      placement="center"
      {...props}
      control={<SidebarControl />}
      css={css`
        display: block !important;
      `}
    >
      {children}
    </Menu>
  );
};

export default SidebarMenu;
