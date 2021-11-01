import React, { forwardRef } from "react";
import Center, { CenterProps } from "./Center";
import { UIComponent } from "../../utils/types";

export type FluidCenterProps = CenterProps;

const FluidCenter: UIComponent<"div", FluidCenterProps> = forwardRef(
  ({ children, ...props }, ref) => {
    return (
      <Center grow={1} {...props} ref={ref}>
        {children}
      </Center>
    );
  }
);

export default FluidCenter;
