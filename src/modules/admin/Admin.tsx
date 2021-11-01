import React from "react";
import Main from "../../layout/Main";
import Sidebar from "./Sidebar";
import { useRouteMatch } from "react-router-dom";
import SplitPane from "react-split-pane";
import ArrayRoute from "../../router/ArrayRoute";
import { panels } from "./router";

const Admin: React.FC = () => {
  const match = useRouteMatch();
  return (
    <Main>
      <SplitPane split="vertical" defaultSize={260}>
        <Sidebar />
        <ArrayRoute routes={panels(match)} sw />
      </SplitPane>
    </Main>
  );
};

export default Admin;
