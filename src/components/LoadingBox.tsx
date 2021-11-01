import React, { forwardRef } from "react";
import FluidCenter, { FluidCenterProps } from "./layout/FluidCenter";
import { Loader, LoaderProps, MantineColor, Text } from "@mantine/core";
import { Assign, UIComponent } from "../utils/types";
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
  }
>;

const LoadingBox: UIComponent<"div", LoadingBoxProps> = forwardRef(
  ({ children, color, size, variant, loaderProps, ...props }, ref) => {
    const th = useTh();
    return (
      <FluidCenter {...props} ref={ref}>
        <Loader
          variant={variant ?? "bars"}
          color={color}
          size={size}
          {...loaderProps}
        />
        <Text
          css={css`
            margin-top: ${th.spacing(4)};
            color: ${th.color("gray.7", "gray.5")};
          `}
        >
          {children ?? "加载中..."}
        </Text>
      </FluidCenter>
    );
  }
);

export default LoadingBox;
