import { Assign } from "../../utils/types";
import { Link, LinkProps } from "../Link";
import React from "react";
import { useTh } from "../../theme/hooks/use-th";
import { css } from "@emotion/react";
import Box from "../layout/Box";
import { Badge } from "@mantine/core";

type SidebarItemProps = Assign<
  LinkProps,
  {
    icon?: React.ReactNode;
    badge?: React.ReactNode;
  }
>;

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  badge,
  children,
  ...props
}) => {
  const th = useTh();
  return (
    <Link
      {...props}
      activeClassName="active"
      exact
      css={css`
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
          color: ${th.color("primary.8", "primary.1")};
          text-decoration: none;
        }

        &.active {
          font-weight: 600;
          color: ${th.color("black", "white")};
          background-color: ${th.color("gray.3", "gray.7")};
        }

        & > span {
          display: flex;
          margin-top: 1px;
        }
      `}
    >
      {icon}
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
    </Link>
  );
};

export default SidebarItem;
