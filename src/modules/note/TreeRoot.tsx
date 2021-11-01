import { UIComponent } from "../../utils/types";
import React, { forwardRef } from "react";
import { css } from "@emotion/react";
import { Tree } from "@minoru/react-dnd-treeview";
import TreeList from "./TreeList";
import TreeItem from "./TreeItem";
import Box from "../../components/layout/Box";
import { TreeMethods, TreeProps } from "@minoru/react-dnd-treeview/dist/types";

type TreeRootProps = Omit<TreeProps<any>, "render"> & {
  treeRef?: React.ForwardedRef<TreeMethods> | undefined;
};

const TreeRoot: UIComponent<"div", TreeRootProps> = forwardRef((props, ref) => {
  return (
    <Box
      ref={ref}
      css={css`
        display: flex;
        flex-direction: column;
        overflow: auto;
        flex-grow: 1;
      `}
    >
      <Tree
        {...props}
        ref={props.treeRef}
        listComponent={TreeList}
        render={TreeItem}
      />
    </Box>
  );
});

export default TreeRoot;
