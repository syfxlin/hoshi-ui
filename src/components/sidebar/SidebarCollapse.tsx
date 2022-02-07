import React, { useState } from "react";
import { Collapse, ThemeIcon, UnstyledButton } from "@mantine/core";
import { Down, Right } from "@icon-park/react";
import { css } from "@emotion/react";
import { useTh } from "../../theme/hooks/use-th";
import Box from "../layout/Box";

type CollapseItemProps = {
  title: string;
  open?: boolean;
  onChange?: (opened: boolean) => void;
};

const SidebarCollapse: React.FC<CollapseItemProps> = ({
  children,
  title,
  open,
  onChange,
}) => {
  const th = useTh();
  const [opened, setOpen] = useState(open ?? false);
  return (
    <>
      <UnstyledButton
        onClick={() => {
          setOpen(!opened);
          onChange?.(!opened);
        }}
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
        `}
      >
        <ThemeIcon variant="light" size="sm">
          {opened ? <Down /> : <Right />}
        </ThemeIcon>
        <Box
          css={css`
            margin-left: ${th.spacing(2)};
            margin-right: ${th.spacing(2)};
            flex-grow: 1;
          `}
        >
          {title}
        </Box>
      </UnstyledButton>
      <Collapse
        in={opened}
        css={css`
          padding-left: ${th.spacing(4)};

          > div {
            display: flex;
            flex-direction: column;

            .mantine-UnstyledButton-root {
              flex: 1;
            }
          }
        `}
      >
        {children}
      </Collapse>
    </>
  );
};

export default SidebarCollapse;
