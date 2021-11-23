import React, { forwardRef } from "react";
import { css } from "@emotion/react";
import { ActionIcon } from "@mantine/core";
import Box from "../layout/Box";
import { HStack, StackProps } from "../layout/Stack";
import { useTh } from "../../theme/hooks/use-th";
import { Assign, UIComponent } from "../../utils/types";

type TreeButtonProps = Assign<
  StackProps,
  {
    icon: React.ReactNode;
  }
>;

const TreeButton: UIComponent<"div", TreeButtonProps> = forwardRef(
  ({ icon, children, ...props }, ref) => {
    const th = useTh();
    return (
      <HStack
        {...props}
        ref={ref}
        spacing={1}
        wrapChildren={false}
        css={css`
          display: flex;
          align-items: center;
          margin: 0 ${th.spacing(2)};
          padding: ${th.spacing(1)} ${th.spacing(2)};
          border-radius: ${th.radius("sm")};
          user-select: none;
          font-size: ${th.fontSize("sm")};
          font-weight: 400;
          color: ${th.color("gray.7", "gray.3")};
          padding-left: ${th.spacing(1)};
          cursor: pointer;
          transition: background-color 150ms;

          &:hover {
            background-color: ${th.color("gray.3", "gray.7")};
            text-decoration: none;
          }
        `}
      >
        <ActionIcon size="xs" variant="transparent">
          {icon}
        </ActionIcon>
        <Box
          css={css`
            flex-grow: 1;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow-x: hidden;
          `}
        >
          {children}
        </Box>
      </HStack>
    );
  }
);

export default TreeButton;
