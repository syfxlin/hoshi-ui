import React, { Children, forwardRef, isValidElement } from "react";
import Flex, { FlexProps } from "./Flex";
import { css } from "@emotion/react";
import { Assign, Styles, UIComponent } from "../../utils/types";
import { useTh } from "../../theme/hooks/use-th";

export type StackProps = Assign<
  FlexProps,
  {
    direction?: "column" | "column-reverse" | "row" | "row-reverse";
    divider?: React.ReactNode;
    spacing?: string | number;
    styles?: Styles<"spacing" | "divider">;
  }
>;

const Stack: UIComponent<"div", StackProps> = forwardRef(
  (
    { direction = "row", divider, spacing = 4, styles, children, ...props },
    ref
  ) => {
    const th = useTh();
    const marginType = (
      {
        column: "margin-top",
        row: "margin-left",
        "column-reverse": "margin-bottom",
        "row-reverse": "margin-right",
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
                    css={css`
                      ${marginType}: ${margin};
                      ${styles?.divider}
                    `}
                  >
                    {divider}
                  </div>
                )}
                <div
                  css={css`
                    ${marginType}: ${isFirst ? undefined : margin};
                    ${styles?.spacing}
                  `}
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
