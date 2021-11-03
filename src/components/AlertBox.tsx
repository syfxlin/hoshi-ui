import React, { forwardRef } from "react";
import FluidCenter, { FluidCenterProps } from "./layout/FluidCenter";
import { Alert, AlertProps, MantineColor } from "@mantine/core";
import { CloseOne } from "@icon-park/react";
import { css } from "@emotion/react";
import { Styles, UIComponent } from "../utils/types";

export interface AlertBoxProps
  extends Omit<FluidCenterProps, "title" | "color"> {
  color?: MantineColor;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  alertProps?: AlertProps;
  styles?: Styles<"alert">;
}

const AlertBox: UIComponent<"div", AlertBoxProps> = forwardRef(
  ({ children, color, icon, title, alertProps, styles, ...props }, ref) => {
    return (
      <FluidCenter {...props} ref={ref}>
        <Alert
          color={color ?? "red"}
          icon={icon ?? <CloseOne />}
          title={title ?? "出错了"}
          {...alertProps}
          css={css`
            max-width: 25rem;
            margin-left: 20px;
            margin-right: 20px;
            ${styles?.alert}
          `}
        >
          {children}
        </Alert>
      </FluidCenter>
    );
  }
);

export default AlertBox;
