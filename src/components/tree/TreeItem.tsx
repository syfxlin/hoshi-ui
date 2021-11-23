import { RenderParams, useDragOver } from "@minoru/react-dnd-treeview";
import React, { MouseEvent } from "react";
import Box from "../../components/layout/Box";
import { Dot, Down, More, Right } from "@icon-park/react";
import { css } from "@emotion/react";
import { useTh } from "../../theme/hooks/use-th";
import { ActionIcon, Loader, Menu } from "@mantine/core";
import { HStack } from "../layout/Stack";
import flattenChildren from "react-keyed-flatten-children";

export interface NodeModel<T = undefined> {
  id: number | string;
  parent: number | string;
  text: string;
  droppable?: boolean;
  loaded?: boolean | "loading";
  data?: T;
}

type TreeItemProps<T> = {
  onLoad?: (node: NodeModel<T>, params: RenderParams) => Promise<void>;
  onClick?: (
    node: NodeModel<T>,
    params: RenderParams,
    event: MouseEvent
  ) => void;
  isActive?: (node: NodeModel<T>, params: RenderParams) => boolean;
  left?: (node: NodeModel<T>, params: RenderParams) => React.ReactNode;
  text: (node: NodeModel<T>, params: RenderParams) => React.ReactNode;
  right?: (node: NodeModel<T>, params: RenderParams) => React.ReactNode;
  menu?: (node: NodeModel<T>, params: RenderParams) => React.ReactNode;
};

const TreeItem =
  <T extends object>(props: TreeItemProps<T>) =>
  (node: NodeModel<T>, params: RenderParams): React.ReactElement => {
    const th = useTh();
    const onToggle = () => {
      if (!node.droppable) {
        return;
      }
      if (props.onLoad && !node.loaded) {
        props.onLoad(node, params).finally(() => params.onToggle());
      } else {
        params.onToggle();
      }
    };
    const dragOverProps = useDragOver(node.id, params.isOpen, onToggle);
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
          padding-left: calc(
            ${th.spacing(1 + params.depth)} + ${params.depth}em
          );
          transition: background-color 150ms;

          &:hover {
            background-color: ${th.color("gray.3", "gray.7")};
            text-decoration: none;
          }

          ${props.isActive?.(node, params) &&
          css`
            font-weight: 600;
            color: ${th.color("black", "white")};
            background-color: ${th.color("gray.3", "gray.7")};
          `}
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
          {node.loaded === "loading" ? (
            <Loader size="xs" />
          ) : node.droppable ? (
            params.isOpen ? (
              <Down />
            ) : (
              <Right />
            )
          ) : (
            <Dot />
          )}
        </ActionIcon>
        {props.left && props.left(node, params)}
        <Box
          onClick={(event: MouseEvent) => props.onClick?.(node, params, event)}
          css={css`
            flex-grow: 1;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow-x: hidden;
            cursor: pointer;
          `}
        >
          {props.text(node, params)}
        </Box>
        {props.right && props.right(node, params)}
        {props.menu && (
          <Menu
            control={
              <ActionIcon size="xs">
                <More />
              </ActionIcon>
            }
          >
            {flattenChildren(props.menu(node, params))}
          </Menu>
        )}
      </HStack>
    );
  };

export default TreeItem;
