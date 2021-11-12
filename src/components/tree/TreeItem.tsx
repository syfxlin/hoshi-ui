import {
  NodeModel,
  RenderParams,
  useDragOver,
} from "@minoru/react-dnd-treeview";
import React from "react";
import Box from "../../components/layout/Box";
import { Dot, Down, Facebook, Github, More, Right } from "@icon-park/react";
import { css } from "@emotion/react";
import { useTh } from "../../theme/hooks/use-th";
import { ActionIcon, Menu } from "@mantine/core";
import { HStack } from "../layout/Stack";

const TreeItem = <T extends object>(
  node: NodeModel<T>,
  { depth, isOpen, onToggle }: RenderParams
): React.ReactElement => {
  const th = useTh();
  const dragOverProps = useDragOver(node.id, isOpen, onToggle);
  return (
    <HStack
      spacing={1}
      wrapChildren={false}
      {...dragOverProps}
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
        padding-left: calc(${th.spacing(1 + depth)} + ${depth}em);
        cursor: pointer;
        transition: background-color 150ms;

        &:hover {
          background-color: ${th.color("gray.3", "gray.7")};
          text-decoration: none;
        }
      `}
    >
      <ActionIcon
        size="xs"
        onClick={onToggle}
        disabled={!node.droppable}
        css={css`
          width: 1em;
          cursor: pointer !important;
        `}
      >
        {node.droppable ? isOpen ? <Down /> : <Right /> : <Dot />}
      </ActionIcon>
      <ActionIcon size="xs">
        <Github />
      </ActionIcon>
      <Box
        css={css`
          flex-grow: 1;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow-x: hidden;
        `}
      >
        {node.text}
      </Box>
      <Menu
        control={
          <ActionIcon size="xs">
            <More />
          </ActionIcon>
        }
      >
        <Menu.Item icon={<Facebook />}>Settings</Menu.Item>
        <Menu.Item icon={<Facebook />}>Messages</Menu.Item>
      </Menu>
    </HStack>
  );
};

export default TreeItem;
