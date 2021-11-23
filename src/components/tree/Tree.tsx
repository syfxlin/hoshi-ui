import {
  Tree as TreeRoot,
  TreeMethods,
  TreeProps as TreeRootProps,
} from "@minoru/react-dnd-treeview";
import { Assign, UIComponent } from "../../utils/types";
import React, { forwardRef } from "react";
import Box from "../layout/Box";
import TreeList from "./TreeList";
import { css } from "@emotion/react";
import { useTh } from "../../theme/hooks/use-th";

export const TreeContext = React.createContext(null);

type TreeProps = Assign<
  TreeRootProps<any>,
  {
    treeRef?: React.ForwardedRef<TreeMethods>;
  }
>;

const Tree: UIComponent<"div", TreeProps> = forwardRef(
  ({ treeRef, ...props }, ref) => {
    const th = useTh();
    return (
      <Box
        ref={ref}
        css={css`
          .drop-target {
            background-color: ${th.color("primary.1")};
          }

          .dragging-source {
            opacity: 0.3;
          }
        `}
      >
        <TreeRoot
          {...props}
          listComponent={TreeList}
          ref={treeRef}
          classes={{
            dropTarget: "drop-target",
            draggingSource: "dragging-source",
          }}
        />
      </Box>
    );
  }
);

export default Tree;
