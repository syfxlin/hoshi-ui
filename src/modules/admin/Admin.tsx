import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { panels } from "./router";
import AppShell from "../../components/app-shell/AppShell";
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
import "react-base-table/styles.css";

const Admin: React.FC = () => {
  const logout = useLogout();
  return (
    <AppShell router={panels}>
      <Sidebar.Menu>
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
      </Sidebar.Menu>
      <Sidebar.Item to="/admin/home" icon={<Home />}>
        主页
      </Sidebar.Item>
      <Sidebar.Collapse title="用户管理">
        <Sidebar.Item to="/admin/users" icon={<Search />}>
          用户
        </Sidebar.Item>
        <Sidebar.Item to="/admin/roles" icon={<Search />}>
          权限
        </Sidebar.Item>
      </Sidebar.Collapse>
    </AppShell>
  );
};

export default Admin;
