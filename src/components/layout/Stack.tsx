import React, { Children, forwardRef, isValidElement } from "react";
import Flex, { FlexProps } from "./Flex";
import { Assign, Styles, UIComponent } from "../../utils/types";
import { useTh } from "../../theme/hooks/use-th";
import { useCss } from "@mantine/core";

export type StackProps = Assign<
  FlexProps,
  {
    direction?: "column" | "column-reverse" | "row" | "row-reverse";
    divider?: React.ReactElement;
    spacing?: string | number;
    wrapChildren?: boolean;
    styles?: Styles<"spacing" | "divider">;
  }
>;

const Stack: UIComponent<"div", StackProps> = forwardRef(
  (
    {
      direction = "row",
      divider,
      spacing = 4,
      wrapChildren = true,
      styles,
      children,
      ...props
    },
    ref
  ) => {
    const th = useTh();
    const { css, cx } = useCss();
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
            const _divider =
              divider &&
              (wrapChildren ? (
                <div
                  className={css`
                    ${marginType}: ${margin};
                    ${styles?.divider}
                  `}
                >
                  {divider}
                </div>
              ) : (
                React.cloneElement(divider, {
                  className: cx(
                    css`
                      ${marginType}: ${margin};
                      ${styles?.divider}
                    `,
                    divider.props.className
                  ),
                })
              ));
            const _child = wrapChildren ? (
              <div
                className={css`
                  ${marginType}: ${isFirst ? undefined : margin};
                  ${styles?.spacing}
                `}
              >
                {child}
              </div>
            ) : (
              React.cloneElement(child, {
                // @ts-ignore
                className: cx(
                  css`
                    ${marginType}: ${isFirst ? undefined : margin};
                    ${styles?.spacing}
                  `,
                  // @ts-ignore
                  child.props.className
                ),
              })
            );
            return (
              <React.Fragment key={`stack-item-${index}`}>
                {!isFirst && _divider}
                {_child}
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
