import React, { useRef } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import useShare from "../../api/use-share";
import { Emoji } from "emoji-mart-virtualized";
import { HStack, VStack } from "../../components/layout/Stack";
import AppShellContainer from "../../components/app-shell/AppShellContainer";
import {
  ActionIcon,
  Breadcrumbs,
  Container,
  Divider,
  Menu,
  Skeleton,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import ColorModeButton from "../../components/header/ColorModeButton";
import AppShellHeader from "../../components/app-shell/AppShellHeader";
import { More } from "@icon-park/react";
import Flex from "../../components/layout/Flex";
import Tiptap from "../../components/form/Tiptap";
import { useTh } from "../../theme/hooks/use-th";
import { Editor } from "@tiptap/react";
import { Link } from "../../components/Link";
import { css } from "@emotion/react";
import Main from "../../components/Main";
import Ellipsis from "../../components/Ellipsis";

const Share: React.FC = () => {
  const th = useTh();
  const navigate = useNavigate();
  // route
  const { noteId: id } = useParams<"noteId">();

  // note & breadcrumbs
  const note = useShare(id);

  // editor
  const editor = useRef<Editor>(null);

  return (
    <>
      {(note.error?.code === "400" ||
        note.error?.response?.data.status === 400) && <Navigate to="/404" />}
      <Main
        css={css`
          position: absolute;
          height: 100%;
          left: 0;
          right: 0;
        `}
      >
        <AppShellContainer>
          <AppShellHeader>
            {note.data ? (
              <Breadcrumbs>
                <Text>{note.data.breadcrumb.workspace.name}</Text>
                {note.data.breadcrumb.parent.map((item) => (
                  <Link key={item.id} to={`/share/${item.id}`}>
                    {item.name}
                  </Link>
                ))}
              </Breadcrumbs>
            ) : (
              <Skeleton height={th.fontSize("lg")} width={th.fontSize(7)} />
            )}
            <HStack spacing="xs" align="center">
              <Menu
                withArrow
                placement="end"
                control={
                  <ActionIcon variant="light" color={th.primaryColor}>
                    <More />
                  </ActionIcon>
                }
              >
                <Menu.Label>
                  最后修改时间：
                  <br />
                  {note.data &&
                    new Date(note.data.updatedTime).toLocaleString()}
                </Menu.Label>
                <Menu.Label>
                  创建时间：
                  <br />
                  {note.data &&
                    new Date(note.data.createdTime).toLocaleString()}
                </Menu.Label>
              </Menu>
              <ColorModeButton />
            </HStack>
          </AppShellHeader>
          {note.attributes.cover ? (
            <Flex
              css={css`
                position: relative;
                height: ${th.spacing(80)};
                background-image: url(${note.attributes.cover as string});
                background-repeat: no-repeat;
                background-size: cover;
                background-position: 50%;
                flex: 0 0 ${th.spacing(80)};

                > * {
                  opacity: 0;
                  transition: opacity 150ms;
                }

                &:hover > * {
                  opacity: 1;
                }
              `}
            />
          ) : (
            <Flex
              justify="center"
              align="center"
              css={css`
                height: ${th.spacing(20)};
                border-bottom: 1px dashed ${th.color("gray.3", "gray.7")};
                opacity: 0;
                transition: opacity 150ms;
                flex: 0 0 ${th.spacing(20)};

                &:hover {
                  opacity: 1;
                }
              `}
            />
          )}
          <Container
            size="lg"
            css={css`
              width: 100%;
              display: flex;
              flex-direction: column;
              flex-grow: 1;
              margin-top: ${th.fontSize(-2)};
              margin-bottom: ${th.spacing(10)};
            `}
          >
            <ActionIcon size={th.theme.fontSizes.base * 4}>
              <Emoji
                set="twitter"
                size={th.theme.fontSizes.base * 3}
                emoji={note.data?.icon || "spiral_note_pad"}
              />
            </ActionIcon>
            <Title
              order={1}
              css={css`
                font-weight: 500;
                margin-bottom: ${th.spacing(4)};
              `}
            >
              {note.data ? (
                note.data?.name ?? "新页面"
              ) : (
                <Skeleton height={th.fontSize("h1")} />
              )}
            </Title>
            <Tiptap
              ref={editor}
              editable={false}
              value={note.data?.content ?? `{"type":"doc"}`}
              onChange={() => {
                //
              }}
            />
            {(note.children.data?.length ?? 0) > 0 && (
              <>
                <Divider />
                <VStack
                  spacing={0}
                  css={css`
                    margin-top: ${th.spacing(5)};
                  `}
                >
                  {note.children.data?.map((item) => (
                    <HStack
                      key={item.id}
                      onClick={() => navigate(`/share/${item.id}`)}
                      wrapChildren={false}
                      css={css`
                        width: 100%;
                        padding: ${th.spacing(2)} ${th.spacing(3)};
                        border-radius: ${th.radius("sm")};
                        cursor: pointer;
                        transition: background-color 150ms;

                        &:hover {
                          background-color: ${th.color("gray.1", "dark.5")};
                        }
                      `}
                    >
                      <ThemeIcon variant="light" size="md">
                        <Emoji
                          set="twitter"
                          size={th.theme.fontSizes.base}
                          emoji={item.icon || "spiral_note_pad"}
                        />
                      </ThemeIcon>
                      <Ellipsis>{item.name}</Ellipsis>
                    </HStack>
                  ))}
                </VStack>
              </>
            )}
          </Container>
        </AppShellContainer>
      </Main>
    </>
  );
};

export default function ShareRemount() {
  // if id change, remount
  const { noteId } = useParams<"noteId">();
  return <Share key={`doc:${noteId}`} />;
}
