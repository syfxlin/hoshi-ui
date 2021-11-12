import {
  Tree as TreeRoot,
  TreeMethods,
  TreeProps as TreeRootProps,
} from "@minoru/react-dnd-treeview";
import { Assign, UIComponent } from "../../utils/types";
import React, { forwardRef } from "react";
import Box from "../layout/Box";
import TreeList from "./TreeList";
import TreeItem from "./TreeItem";

type TreeProps = Assign<
  Omit<TreeRootProps<any>, "render">,
  {
    treeRef?: React.ForwardedRef<TreeMethods>;
  }
>;

const Tree: UIComponent<"div", TreeProps> = forwardRef(
  ({ treeRef, ...props }, ref) => {
    return (
      <Box ref={ref}>
        <TreeRoot
          {...props}
          listComponent={TreeList}
          render={TreeItem}
          ref={treeRef}
        />
      </Box>
    );
  }
);

export default Tree;
