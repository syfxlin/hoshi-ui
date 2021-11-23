import React from "react";
import AppShell from "../../components/app-shell/AppShell";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Dashboard: React.FC = () => {
  return (
    <AppShell>
      <Sidebar />
      <Outlet />
    </AppShell>
  );
};

export default Dashboard;
