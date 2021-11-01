import { NodeModel, RenderParams } from "@minoru/react-dnd-treeview/dist/types";
import React from "react";
import Box from "../../components/layout/Box";
import { Down, Github, Right } from "@icon-park/react";
import { css } from "@emotion/react";
import { useTh } from "../../theme/hooks/use-th";

const TreeItem = <T extends object>(
  node: NodeModel<T>,
  { depth, isOpen, onToggle }: RenderParams
): React.ReactElement => {
  const th = useTh();
  const OpenIcon = node.droppable && (isOpen ? Down : Right);
  return (
    <Box
      css={css`
        display: flex;
        align-items: center;
        margin: 0 ${th.spacing(2)};
        padding: ${th.spacing(2)} ${th.spacing(3)};
        border-radius: ${th.radius("sm")};
        font-size: ${th.fontSize("sm")};
        font-weight: 400;
        color: ${th.color("gray.7", "gray.3")};
        transition: background-color 150ms;
        white-space: nowrap;
        width: max-content;
        padding-left: calc(${th.spacing(3)} + ${depth}em + ${depth * 5}px);
        cursor: pointer;

        &:hover {
          color: ${th.color("primary.8", "primary.1")};
          text-decoration: none;
        }

        & > span,
        & > * > span {
          display: flex;
          margin-top: 1px;
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
      <Box
        css={css`
          margin-left: 5px;
        `}
      >
        <Github />
      </Box>
      <Box
        css={css`
          margin-left: 5px;
          flex-grow: 1;
        `}
      >
        {node.text}
      </Box>
    </Box>
  );
};

export default TreeItem;
