import React from "react";
import SSidebar from "../../components/sidebar/Sidebar";
import SidebarMenu from "../../components/sidebar/SidebarMenu";
import { Divider, Menu, Text } from "@mantine/core";
import {
  Facebook,
  Github,
  Gitlab,
  Home,
  Logout,
  Search,
  Twitter,
} from "@icon-park/react";
import { useLogout } from "../../api/ums";
import SidebarItem from "../../components/sidebar/SidebarItem";
import CollapseItem from "../../components/sidebar/CollapseItem";

const Sidebar: React.FC = () => {
  const logout = useLogout();
  return (
    <SSidebar>
      <SidebarMenu>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item icon={<Facebook />}>Settings</Menu.Item>
        <Menu.Item icon={<Facebook />}>Messages</Menu.Item>
        <Menu.Item icon={<Github />}>Gallery</Menu.Item>
        <Menu.Item
          icon={<Gitlab />}
          rightSection={
            <Text size="xs" color="gray">
              ⌘K
            </Text>
          }
        >
          Search
        </Menu.Item>
        <Divider />
        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item icon={<Twitter />}>Transfer my data</Menu.Item>,
        <Menu.Item color="red" icon={<Logout />} onClick={logout}>
          登出
        </Menu.Item>
      </SidebarMenu>
      <SidebarItem to="/admin/home" icon={<Home />}>
        主页
      </SidebarItem>
      <CollapseItem title="用户管理">
        <SidebarItem to="/admin/users" icon={<Search />}>
          用户列表
        </SidebarItem>
      </CollapseItem>
    </SSidebar>
  );
};

export default Sidebar;
