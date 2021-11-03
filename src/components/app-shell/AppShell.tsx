import React, { forwardRef } from "react";
import Main from "../Main";
import SplitPane from "react-split-pane";
import { UIComponent } from "../../utils/types";
import { BoxProps } from "../layout/Box";

const AppShell: UIComponent<"main", BoxProps> = forwardRef(
  ({ children, ...props }, ref) => {
    return (
      <Main {...props} ref={ref}>
        <SplitPane split="vertical" defaultSize={260}>
          {children}
        </SplitPane>
      </Main>
    );
  }
);

export default AppShell;
