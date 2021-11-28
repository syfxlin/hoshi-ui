import React, { forwardRef } from "react";
import { Assign, UIComponent } from "../../utils/types";
import { HStack, StackProps, VStack } from "../layout/Stack";
import { ListNoteView } from "../../api/note";
import { css } from "@emotion/react";
import { Breadcrumbs, ThemeIcon } from "@mantine/core";
import { Emoji } from "emoji-mart-virtualized";
import { useTh } from "../../theme/hooks/use-th";
import Ellipsis from "../Ellipsis";
import { Link } from "../Link";

type NoteCardProps = Assign<
  StackProps,
  {
    note: ListNoteView;
  }
>;

const NoteCard: UIComponent<"div", NoteCardProps> = forwardRef(
  ({ note, children, ...props }, ref) => {
    const th = useTh();
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
          <HStack
            justify="space-between"
            wrapChildren={false}
            align="center"
            css={css`
              width: 100%;
              overflow-x: hidden;
            `}
          >
            <Ellipsis color="dimmed" size="xs">
              <strong>最后修改时间：</strong>
              <span>{new Date(note.updatedTime).toLocaleString()}</span>
              <span>，</span>
              <strong>创建时间：</strong>
              <span>{new Date(note.createdTime).toLocaleString()}</span>
            </Ellipsis>
            <Breadcrumbs
              styles={{
                root: {
                  maxWidth: "50%",
                },
              }}
            >
              <Ellipsis
                as={Link}
                size="xs"
                to={`/workspace/${note.breadcrumb.workspace.id}`}
              >
                {note.breadcrumb.workspace.name}
              </Ellipsis>
              {note.breadcrumb.parent.map((item) => (
                <Ellipsis
                  key={item.id}
                  as={Link}
                  size="xs"
                  to={`/doc/${item.id}/preview`}
                >
                  {item.name}
                </Ellipsis>
              ))}
            </Breadcrumbs>
          </HStack>
        </VStack>
        {children}
      </HStack>
    );
  }
);

export default NoteCard;
