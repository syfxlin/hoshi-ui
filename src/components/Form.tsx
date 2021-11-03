import React, { forwardRef } from "react";
import { UIComponent } from "../utils/types";
import { StackProps, VStack } from "./layout/Stack";

const Form: UIComponent<"form", StackProps> = forwardRef((props, ref) => {
  return <VStack {...props} as="form" />;
});

export default Form;
