import React, { forwardRef } from "react";
import Flex, { FlexProps } from "./Flex";
import { UIComponent } from "../../utils/types";

export type CenterProps = FlexProps;

const Center: UIComponent<"div", CenterProps> = forwardRef((props, ref) => (
  <Flex
    direction="column"
    justify="center"
    align="center"
    {...props}
    ref={ref}
  />
));

export default Center;
