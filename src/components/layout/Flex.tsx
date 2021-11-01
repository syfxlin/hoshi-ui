import React, { forwardRef } from "react";
import { CSSObject } from "@mantine/core";
import { css } from "@emotion/react";
import Box, { BoxProps } from "./Box";
import { Assign, UIComponent } from "../../utils/types";

export type FlexProps = Assign<
  BoxProps,
  {
    align?: CSSObject["alignItems"];
    basis?: CSSObject["flexBasis"];
    direction?: CSSObject["flexDirection"];
    grow?: CSSObject["flexGrow"];
    justify?: CSSObject["justifyContent"];
    shrink?: CSSObject["flexShrink"];
    wrap?: CSSObject["flexWrap"];
    inline?: boolean;
  }
>;

const Flex: UIComponent<"div", FlexProps> = forwardRef(
  (
    { align, basis, direction, grow, justify, shrink, wrap, inline, ...props },
    ref
  ) => {
    return (
      <Box
        {...props}
        ref={ref}
        css={css`
          display: ${inline ? "inline-flex" : "flex"};
          align-items: ${align};
          flex-basis: ${basis};
          flex-direction: ${direction};
          flex-grow: ${grow};
          justify-content: ${justify};
          flex-shrink: ${shrink};
          flex-wrap: ${wrap};
        `}
      />
    );
  }
);

export default Flex;
