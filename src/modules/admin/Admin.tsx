import React from "react";
import AppShell from "../../components/app-shell/AppShell";
import "react-base-table/styles.css";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Admin: React.FC = () => {
  return (
    <AppShell>
      <Sidebar />
      <Outlet />
    </AppShell>
  );
};

export default Admin;
