import React, { forwardRef } from "react";
import { Assign, UIComponent } from "../../utils/types";
import { HStack, StackProps, VStack } from "../layout/Stack";
import { ListNoteView } from "../../api/note";
import { css } from "@emotion/react";
import { ThemeIcon } from "@mantine/core";
import { Emoji } from "emoji-mart-virtualized";
import { useTh } from "../../theme/hooks/use-th";
import { useWorkspaces } from "../../api/use-workspace";
import Ellipsis from "../Ellipsis";

type NoteCardProps = Assign<
  StackProps,
  {
    note: ListNoteView;
  }
>;

const NoteCard: UIComponent<"div", NoteCardProps> = forwardRef(
  ({ note, children, ...props }, ref) => {
    const th = useTh();
    const workspaces = useWorkspaces(false);
    return (
      <HStack
        wrapChildren={false}
        css={css`
          width: 100%;
          align-items: center;
          padding: ${th.spacing(2)};
          border-radius: ${th.radius("sm")};
          cursor: pointer;
          transition: background-color 150ms;

          &:hover {
            background-color: ${th.color("gray.1", "dark.5")};
          }
        `}
      >
        <ThemeIcon variant="light" size="xl">
          <Emoji
            set="twitter"
            size={th.theme.fontSizes.base}
            emoji={note.icon || "spiral_note_pad"}
          />
        </ThemeIcon>
        <VStack
          {...props}
          ref={ref}
          spacing={1}
          css={css`
            flex-grow: 1;
            overflow-x: hidden;
          `}
        >
          <Ellipsis weight={500}>{note.name}</Ellipsis>
          <Ellipsis color="dimmed" size="xs">
            <strong>工作区：</strong>
            <span>{workspaces.data?.get(note.workspace)?.data?.name}</span>
            <span>，</span>
            <strong>最后修改时间：</strong>
            <span>{new Date(note.updatedTime).toLocaleString()}</span>
            <span>，</span>
            <strong>创建时间：</strong>
            <span>{new Date(note.createdTime).toLocaleString()}</span>
            <span>，</span>
            <strong>状态：</strong>
            <span>{note.status}</span>
          </Ellipsis>
        </VStack>
        {children}
      </HStack>
    );
  }
);

export default NoteCard;
