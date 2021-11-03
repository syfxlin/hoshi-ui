import React, { forwardRef } from "react";
import FluidCenter, { FluidCenterProps } from "./layout/FluidCenter";
import { Loader, LoaderProps, MantineColor, Text } from "@mantine/core";
import { Assign, Styles, UIComponent } from "../utils/types";
import { css } from "@emotion/react";
import { MantineNumberSize } from "@mantine/styles";
import { useTh } from "../theme/hooks/use-th";

export type LoadingBoxProps = Assign<
  FluidCenterProps,
  {
    color?: MantineColor;
    size?: MantineNumberSize;
    variant?: LoaderProps["variant"];
    loaderProps?: LoaderProps;
    styles?: Styles<"loader" | "text">;
  }
>;

const LoadingBox: UIComponent<"div", LoadingBoxProps> = forwardRef(
  ({ children, color, size, variant, loaderProps, styles, ...props }, ref) => {
    const th = useTh();
    return (
      <FluidCenter {...props} ref={ref}>
        <Loader
          variant={variant ?? "bars"}
          color={color}
          size={size}
          {...loaderProps}
          css={styles?.loader}
        />
        <Text
          css={css`
            margin-top: ${th.spacing(4)};
            color: ${th.color("gray.7", "gray.5")};
            ${styles?.text}
          `}
        >
          {children ?? "加载中..."}
        </Text>
      </FluidCenter>
    );
  }
);

export default LoadingBox;
