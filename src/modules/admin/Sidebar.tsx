import CSidebar from "../../components/sidebar/Sidebar";
import React from "react";
import SidebarMenu from "../../components/sidebar/SidebarMenu";
import { Divider, Menu } from "@mantine/core";
import {
  Bug,
  Control,
  DarkMode,
  Dashboard,
  Github,
  Home,
  Logout,
  User,
} from "@icon-park/react";
import { logout } from "../../api/ums";
import SidebarItem from "../../components/sidebar/SidebarItem";
import SidebarCollapse from "../../components/sidebar/SidebarCollapse";
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "../../theme/EmotionSystemProvider";
import SidebarButton from "../../components/sidebar/SidebarButton";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [, toggleColorScheme] = useColorScheme();
  return (
    <CSidebar>
      <SidebarMenu>
        <Menu.Item icon={<Home />} onClick={() => navigate(`/dashboard/home`)}>
          工作区
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
        <Menu.Item icon={<DarkMode />} onClick={() => toggleColorScheme()}>
          切换颜色模式
        </Menu.Item>
        <Divider />
        <Menu.Item color="red" icon={<Logout />} onClick={logout}>
          登出
        </Menu.Item>
      </SidebarMenu>
      <SidebarCollapse title="用户管理">
        <SidebarItem to="/admin/users" icon={<User />}>
          用户
        </SidebarItem>
        <SidebarItem to="/admin/roles" icon={<Control />}>
          角色
        </SidebarItem>
      </SidebarCollapse>
      <SidebarCollapse title="服务管理">
        <SidebarButton
          icon={<Dashboard />}
          onClick={() => window.open(import.meta.env.VITE_MINIO_URL)}
        >
          Minio
        </SidebarButton>
        <SidebarButton
          icon={<Dashboard />}
          onClick={() => window.open(import.meta.env.VITE_TIDB_URL)}
        >
          TiDB
        </SidebarButton>
        <SidebarButton
          icon={<Dashboard />}
          onClick={() => window.open(import.meta.env.VITE_TRAEFIK_URL)}
        >
          Treafik
        </SidebarButton>
      </SidebarCollapse>
      <SidebarCollapse title="指标管理">
        <SidebarButton
          icon={<Dashboard />}
          onClick={() => window.open(import.meta.env.VITE_GRAFANA_URL)}
        >
          Grafana
        </SidebarButton>
        <SidebarButton
          icon={<Dashboard />}
          onClick={() => window.open(import.meta.env.VITE_PROMETHEUS_URL)}
        >
          Prometheus
        </SidebarButton>
      </SidebarCollapse>
    </CSidebar>
  );
};

export default Sidebar;
