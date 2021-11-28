import CSidebar from "../../components/sidebar/Sidebar";
import React from "react";
import SidebarMenu from "../../components/sidebar/SidebarMenu";
import { Divider, Menu, Space } from "@mantine/core";
import {
  Box as BoxIcon,
  Bug,
  DarkMode,
  Delete,
  Drone,
  FolderClose,
  Github,
  Home,
  Logout,
  Search,
  Setting,
} from "@icon-park/react";
import { logout } from "../../api/ums";
import SidebarItem from "../../components/sidebar/SidebarItem";
import SidebarButton from "../../components/sidebar/SidebarButton";
import { useSearchModal } from "./panels/Search";
import WorkspaceTree from "./sidebar/WorkspaceTree";
import { useColorScheme } from "../../theme/EmotionSystemProvider";
import { useNavigate } from "react-router-dom";
import useMe from "../../api/use-me";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [, toggleColorScheme] = useColorScheme();
  const [, setSearch] = useSearchModal();
  const me = useMe();
  return (
    <CSidebar>
      <SidebarMenu>
        <Menu.Item icon={<Setting />} onClick={() => navigate(`/settings`)}>
          设置
        </Menu.Item>
        <Divider />
        <Menu.Item
          icon={<Github />}
          onClick={() => window.open("https://github.com/syfxlin/hoshi-note")}
        >
          Github
        </Menu.Item>
        <Menu.Item
          icon={<Bug />}
          onClick={() =>
            window.open("https://github.com/syfxlin/hoshi-note/issues")
          }
        >
          提交 Bug
        </Menu.Item>
        {me.data?.roles.find(({ name }) => name === "ADMIN") && (
          <Menu.Item icon={<Drone />} onClick={() => navigate(`/admin/home`)}>
            管理员
          </Menu.Item>
        )}
        <Menu.Item icon={<DarkMode />} onClick={() => toggleColorScheme()}>
          切换颜色模式
        </Menu.Item>
        <Divider />
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
