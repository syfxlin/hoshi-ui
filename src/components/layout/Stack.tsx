import React, { Children, forwardRef, isValidElement } from "react";
import Flex, { FlexProps } from "./Flex";
import { css, CSSObject } from "@emotion/react";
import { Assign, UIComponent } from "../../utils/types";
import { useTh } from "../../theme/hooks/use-th";

export type StackProps = Assign<
  FlexProps,
  {
    direction?: "column" | "column-reverse" | "row" | "row-reverse";
    divider?: React.ReactNode;
    spacing?: string | number;
    childStyles?: Record<number, CSSObject>;
  }
>;

const Stack: UIComponent<"div", StackProps> = forwardRef(
  (
    {
      direction = "row",
      divider,
      spacing = 4,
      children,
      childStyles,
      ...props
    },
    ref
  ) => {
    const th = useTh();
    const marginType = (
      {
        column: "marginTop",
        row: "marginLeft",
        "column-reverse": "marginBottom",
        "row-reverse": "marginRight",
      } as const
    )[direction];
    return (
      <Flex {...props} direction={direction} ref={ref}>
        {Children.toArray(children)
          .filter(isValidElement)
          .map((child, index) => {
            const isFirst = index === 0;
            const margin = th.spacing(spacing);
            return (
              <React.Fragment key={`stack-item-${index}`}>
                {!isFirst && divider && (
                  <div
                    css={css({
                      [marginType]: margin,
                    })}
                  >
                    {divider}
                  </div>
                )}
                <div
                  css={css({
                    [marginType]: isFirst ? undefined : margin,
                    ...(childStyles?.[index] || {}),
                  })}
                >
                  {child}
                </div>
              </React.Fragment>
            );
          })}
      </Flex>
    );
  }
);

export default Stack;

export const VStack: UIComponent<"div", StackProps> = forwardRef(
  (props, ref) => <Stack {...props} direction="column" ref={ref} />
);

export const HStack: UIComponent<"div", StackProps> = forwardRef(
  (props, ref) => <Stack {...props} direction="row" ref={ref} />
);
