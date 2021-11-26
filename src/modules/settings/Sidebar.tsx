import React from "react";
import CSidebar from "../../components/sidebar/Sidebar";
import { Left, Search } from "@icon-park/react";
import SidebarItem from "../../components/sidebar/SidebarItem";
import SidebarControl from "../../components/sidebar/SidebarControl";
import { history } from "../../router/history";

const Sidebar: React.FC = () => {
  return (
    <CSidebar>
      <SidebarControl
        icon={<Left />}
        text="返回应用"
        onClick={() => history.push("/dashboard/home")}
      />
      <SidebarItem to="/settings" icon={<Search />}>
        基本资料
      </SidebarItem>
      <SidebarItem to="/settings/safety" icon={<Search />}>
        账号安全
      </SidebarItem>
      <SidebarItem to="/settings/tokens" icon={<Search />}>
        API 令牌
      </SidebarItem>
    </CSidebar>
  );
};

export default Sidebar;
