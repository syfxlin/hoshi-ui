import React, { useState } from "react";
import AppShell from "../../components/app-shell/AppShell";
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
import { Divider, Menu, Text } from "@mantine/core";
import Sidebar from "../../components/sidebar/Sidebar";
import { dashboard } from "./router";
import ArrayRoute from "../../router/ArrayRoute";
import SidebarMenu from "../../components/sidebar/SidebarMenu";
import SidebarItem from "../../components/sidebar/SidebarItem";
import Tree from "../../components/tree/Tree";

const Dashboard: React.FC = () => {
  const [tree, setTree] = useState<any>([
    {
      id: 1,
      parent: 0,
      droppable: true,
      text: "Folder 1",
    },
    {
      id: 2,
      parent: 1,
      text: "File 1-1",
    },
    {
      id: 3,
      parent: 1,
      text: "File 1-2",
    },
    {
      id: 4,
      parent: 0,
      droppable: true,
      text: "Folder 2",
    },
    {
      id: 5,
      parent: 4,
      droppable: true,
      text: "Folder 2-1",
    },
    {
      id: 6,
      parent: 5,
      droppable: true,
      text: "Folder 2-1-1",
    },
    {
      id: 7,
      parent: 6,
      droppable: true,
      text: "Folder 2-1-1-1",
    },
    {
      id: 8,
      parent: 7,
      droppable: true,
      text: "Folder 2-1-1-1-1",
    },
    {
      id: 9,
      parent: 8,
      droppable: true,
      text: "Folder 2-1-1-1-1-1",
    },
    {
      id: 10,
      parent: 9,
      droppable: true,
      text: "Folder 2-1-1-1-1-1-1",
    },
    {
      id: 11,
      parent: 10,
      text: "File 2-1-1",
    },
  ]);
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
        <SidebarItem to="/dashboard/home" icon={<Home />}>
          主页
        </SidebarItem>
        <SidebarItem to="/dashboard/search" icon={<Search />}>
          搜索
        </SidebarItem>
        <SidebarItem to="/dashboard/files" icon={<Search />}>
          文件管理
        </SidebarItem>
        <SidebarItem to="/settings" icon={<Search />}>
          设置
        </SidebarItem>
        <Tree tree={tree} onDrop={(data) => setTree(data)} rootId={0} />
      </Sidebar>
      <ArrayRoute routes={dashboard} />
    </AppShell>
  );
};

export default Dashboard;
