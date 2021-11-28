import CSidebar from "../../components/sidebar/Sidebar";
import React from "react";
import SidebarMenu from "../../components/sidebar/SidebarMenu";
import { Divider, Menu, Space, Text } from "@mantine/core";
import {
  Box as BoxIcon,
  Delete,
  Facebook,
  FolderClose,
  Github,
  Gitlab,
  Home,
  Logout,
  Search,
  Setting,
  Twitter,
} from "@icon-park/react";
import { logout } from "../../api/ums";
import SidebarItem from "../../components/sidebar/SidebarItem";
import SidebarButton from "../../components/sidebar/SidebarButton";
import { useSearchModal } from "./panels/Search";
import WorkspaceTree from "./sidebar/WorkspaceTree";

const Sidebar: React.FC = () => {
  const [, setSearch] = useSearchModal();
  return (
    <CSidebar>
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
      <SidebarButton icon={<Search />} onClick={() => setSearch(true)}>
        搜索
      </SidebarButton>
      <SidebarItem to="/dashboard/files" icon={<FolderClose />}>
        文件
      </SidebarItem>
      <WorkspaceTree />
      <SidebarItem to="/archive" icon={<BoxIcon />}>
        归档
      </SidebarItem>
      <SidebarItem to="/trash" icon={<Delete />}>
        回收站
      </SidebarItem>
      <SidebarItem to="/settings" icon={<Setting />}>
        设置
      </SidebarItem>
      <Space h="xs" />
    </CSidebar>
  );
};

export default Sidebar;
