import React from "react";
import AppShell from "../../components/app-shell/AppShell";
import Sidebar from "../../components/sidebar/Sidebar";
import SidebarControl from "../../components/sidebar/SidebarControl";
import { Left, Search } from "@icon-park/react";
import { history } from "../../store/history";
import ArrayRoute from "../../router/ArrayRoute";
import { settings } from "./router";
import SidebarItem from "../../components/sidebar/SidebarItem";

const Settings: React.FC = () => {
  return (
    <AppShell>
      <Sidebar>
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
      </Sidebar>
      <ArrayRoute routes={settings} />
    </AppShell>
  );
};

export default Settings;
