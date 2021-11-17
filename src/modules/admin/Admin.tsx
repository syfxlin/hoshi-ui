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
import { logout } from "../../api/ums";
import "react-base-table/styles.css";
import ArrayRoute from "../../router/ArrayRoute";
import SidebarMenu from "../../components/sidebar/SidebarMenu";
import SidebarItem from "../../components/sidebar/SidebarItem";
import SidebarCollapse from "../../components/sidebar/SidebarCollapse";

const Admin: React.FC = () => {
  return (
    <AppShell>
      <Sidebar>
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
        <SidebarCollapse title="用户管理">
          <SidebarItem to="/admin/users" icon={<Search />}>
            用户
          </SidebarItem>
          <SidebarItem to="/admin/roles" icon={<Search />}>
            角色
          </SidebarItem>
        </SidebarCollapse>
      </Sidebar>
      <ArrayRoute routes={panels} />
    </AppShell>
  );
};

export default Admin;
