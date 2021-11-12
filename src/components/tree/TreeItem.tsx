import { NodeModel, RenderParams } from "@minoru/react-dnd-treeview/dist/types";
import React from "react";
import Box from "../../components/layout/Box";
import { Down, Github, More, Right } from "@icon-park/react";
import { css } from "@emotion/react";
import { useTh } from "../../theme/hooks/use-th";
import { ActionIcon } from "@mantine/core";
import { HStack } from "../layout/Stack";

const TreeItem = <T extends object>(
  node: NodeModel<T>,
  { depth, isOpen, onToggle }: RenderParams
): React.ReactElement => {
  const th = useTh();
  const OpenIcon = node.droppable && (isOpen ? Down : Right);
  return (
    <HStack
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
        padding-left: calc(${th.spacing(1 + depth)} + ${depth}em);
        cursor: pointer;
        transition: background-color 150ms;

        &:hover {
          background-color: ${th.color("gray.3", "gray.7")};
          text-decoration: none;
        }
      `}
    >
      <Box
        css={css`
          width: 1em;
        `}
      >
        {OpenIcon && <OpenIcon onClick={onToggle} />}
      </Box>
      <Box>
        <Github />
      </Box>
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
      <ActionIcon size="xs">
        <More />
      </ActionIcon>
    </HStack>
  );
};

export default TreeItem;
