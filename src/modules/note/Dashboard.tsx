import React from "react";
import { Affix } from "@mantine/core";
import ColorModeButton from "../../layout/header/ColorModeButton";
import Sidebar from "./Sidebar";
import Main from "../../layout/Main";
import SplitPane from "react-split-pane";

const Dashboard: React.FC = () => {
  return (
    <Main>
      <SplitPane split="vertical" defaultSize={260}>
        <Sidebar />
        <div>Dashboard</div>
      </SplitPane>
      <Affix position={{ top: 10, right: 10 }}>
        <ColorModeButton />
      </Affix>
    </Main>
  );
};

export default Dashboard;
