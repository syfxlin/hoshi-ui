import React from "react";
import Main from "../Main";
import SplitPane from "react-split-pane";
import Sidebar from "../sidebar/Sidebar";
import { match } from "react-router";
import { RouteDefinition } from "../../router";
import ArrayRoute from "../../router/ArrayRoute";
import { useRouteMatch } from "react-router-dom";
import AppShellContainer from "./AppShellContainer";

type AppShellProps = {
  router: (match: match) => RouteDefinition[];
};

type AppShellComponent = React.FC<AppShellProps> & {
  Container: typeof AppShellContainer;
};

const AppShell: AppShellComponent = ({ children, router }) => {
  const match = useRouteMatch();
  return (
    <Main>
      <SplitPane split="vertical" defaultSize={260}>
        <Sidebar>{children}</Sidebar>
        <ArrayRoute routes={router(match)} sw />
      </SplitPane>
    </Main>
  );
};

AppShell.Container = AppShellContainer;

export default AppShell;
