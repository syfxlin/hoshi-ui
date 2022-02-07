import { Assign } from "../../utils/types";
import React from "react";
import { useTh } from "../../theme/hooks/use-th";
import { css } from "@emotion/react";
import Box from "../layout/Box";
import {
  Badge,
  ThemeIcon,
  UnstyledButton,
  UnstyledButtonProps,
} from "@mantine/core";

type SidebarButtonProps = Assign<
  UnstyledButtonProps,
  {
    icon?: React.ReactNode;
    badge?: React.ReactNode;
  }
>;

const SidebarButton: React.FC<SidebarButtonProps> = ({
  icon,
  badge,
  children,
  ...props
}) => {
  const th = useTh();
  return (
    <UnstyledButton
      {...props}
      css={css`
        flex: 1;
        display: flex;
        align-items: center;
        margin: 0 ${th.spacing(2)};
        padding: ${th.spacing(2)} ${th.spacing(3)};
        border-radius: ${th.radius("sm")};
        user-select: none;
        font-size: ${th.fontSize("sm")};
        font-weight: 400;
        line-height: ${th.lineHeight("md")};
        color: ${th.color("gray.7", "gray.3")};
        transition: background-color 150ms;

        &:hover {
          background-color: ${th.color("gray.3", "gray.7")};
          text-decoration: none;
        }

        &.active {
          font-weight: 600;
          color: ${th.color("black", "white")};
          background-color: ${th.color("gray.3", "gray.7")};
        }
      `}
    >
      <ThemeIcon variant="light" size="sm">
        {icon}
      </ThemeIcon>
      <Box
        css={css`
          margin-left: ${th.spacing(2)};
          margin-right: ${th.spacing(2)};
          flex-grow: 1;
        `}
      >
        {children}
      </Box>
      {badge && <Badge size="xs">{badge}</Badge>}
    </UnstyledButton>
  );
};

export default SidebarButton;
