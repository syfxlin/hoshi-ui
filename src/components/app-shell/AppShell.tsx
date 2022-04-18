import React, { forwardRef, useState } from "react";
import Main from "../Main";
import SplitPane from "react-split-pane";
import { UIComponent } from "../../utils/types";
import { BoxProps } from "../layout/Box";
import { useUp } from "../../theme/hooks/use-breakpoint";
import { ActionIcon, Affix } from "@mantine/core";
import { ApplicationMenu } from "@icon-park/react";
import { useTh } from "../../theme/hooks/use-th";

const AppShell: UIComponent<"main", BoxProps> = forwardRef(
  ({ children, ...props }, ref) => {
    const th = useTh();
    const matches = !useUp("md");
    const [open, setOpen] = useState(false);
    return (
      <Main {...props} ref={ref}>
        <SplitPane
          split="vertical"
          defaultSize={260}
          pane1Style={
            matches
              ? {
                  position: "fixed",
                  height: "100%",
                  width: "100%",
                  zIndex: 100,
                  transform: `translateX(${open ? "0%" : "-100%"})`,
                  transition: `transform 0.5s`,
                }
              : undefined
          }
        >
          {children}
        </SplitPane>
        {matches && (
          <Affix position={{ bottom: 20, right: 20 }}>
            <ActionIcon
              variant="light"
              size="xl"
              color={th.primaryColor}
              onClick={() => setOpen((v) => !v)}
            >
              <ApplicationMenu />
            </ActionIcon>
          </Affix>
        )}
      </Main>
    );
  }
);

export default AppShell;
