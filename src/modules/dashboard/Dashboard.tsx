import React from "react";
import AppShell from "../../components/app-shell/AppShell";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { Search } from "./panels/Search";

const Dashboard: React.FC = () => {
  return (
    <Search>
      <AppShell>
        <Sidebar />
        <Outlet />
      </AppShell>
    </Search>
  );
};

export default Dashboard;
