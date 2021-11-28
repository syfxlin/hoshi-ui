import React, { useState } from "react";
import AppShellContainer from "../../../components/app-shell/AppShellContainer";
import AppShellHeader from "../../../components/app-shell/AppShellHeader";
import { HStack, VStack } from "../../../components/layout/Stack";
import ColorModeButton from "../../../components/header/ColorModeButton";
import { css } from "@emotion/react";
import {
  ActionIcon,
  Button,
  Container,
  Divider,
  Loader,
  Menu,
  Pagination,
  SegmentedControl,
  Skeleton,
  Tab,
  Tabs,
  TextInput,
  Title,
} from "@mantine/core";
import { useTh } from "../../../theme/hooks/use-th";
import { Emoji } from "emoji-mart-virtualized";
import { useNavigate, useParams } from "react-router-dom";
import useNotes from "../../../api/use-notes";
import {
  Copy,
  CopyLink,
  Delete,
  Editor,
  More,
  Move,
  OpenDoor,
  Search,
} from "@icon-park/react";
import Async from "../../../components/Async";
import NoteCard from "../../../components/panel/NoteCard";
import useLoading from "../../../utils/use-loading";
import { ListNoteView } from "../../../api/note";
import { link } from "../../../api/url";
import { Box as BoxIcon } from "@icon-park/react/lib/map";
import Omnibar from "../../../components/panel/Omnibar";
import Ellipsis from "../../../components/Ellipsis";

const Workspace: React.FC = () => {
  const th = useTh();
  // route
  const navigate = useNavigate();
  const { workspaceId: id } = useParams<"workspaceId">();
  // notes
  const notes = useNotes(id);
  // loading & move
  const add = useLoading();
  const [move, setMove] = useState<ListNoteView | null>(null);

  return (
    <AppShellContainer>
      <AppShellHeader>
        <HStack spacing="xs" align="center">
          <Emoji
            set="twitter"
            size={th.theme.fontSizes.base}
            emoji={notes.workspace?.icon || "file_folder"}
          />
          <Ellipsis weight={500}>{notes.workspace?.name}</Ellipsis>
        </HStack>
        <HStack spacing="xs" align="center">
          <SegmentedControl
            value={notes.sort[0]}
            onChange={(value) => notes.setSort([value, notes.sort[1]])}
            size="xs"
            data={[
              { label: "笔记名称", value: "name" },
              { label: "创建时间", value: "createdTime" },
              { label: "最后修改时间", value: "updatedTime" },
            ]}
          />
          <SegmentedControl
            value={notes.sort[1]}
            onChange={(value: "asc" | "desc") =>
              notes.setSort([notes.sort[0], value])
            }
            size="xs"
            data={[
              { label: "顺序", value: "asc" },
              { label: "逆序", value: "desc" },
            ]}
          />
          <TextInput
            aria-label="搜索笔记"
            placeholder="搜索笔记"
            size="xs"
            icon={<Search />}
            value={notes.search}
            onChange={(e) => notes.setSearch(e.currentTarget.value)}
            rightSection={
              !notes.error && !notes.data ? <Loader size="xs" /> : <div />
            }
          />
          <Button
            size="xs"
            loading={add.loading}
            onClick={() => add.wrap(notes.$addNote({ name: "新页面" }))}
          >
            新建笔记
          </Button>
          <ColorModeButton />
        </HStack>
      </AppShellHeader>
      <Container
        size="lg"
        css={css`
          width: 100%;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          margin-top: ${th.spacing(10)};
          margin-bottom: ${th.spacing(10)};
        `}
      >
        <ActionIcon size={th.theme.fontSizes.base * 4}>
          <Emoji
            set="twitter"
            size={th.theme.fontSizes.base * 3}
            emoji={notes.workspace?.icon || "file_folder"}
          />
        </ActionIcon>
        <Title
          order={1}
          css={css`
            font-weight: 500;
            margin-bottom: ${th.spacing(4)};
          `}
        >
          {notes.workspace?.name ? (
            notes.workspace.name
          ) : (
            <Skeleton height={th.fontSize("h1")} />
          )}
        </Title>
        <Async query={notes}>
          <Tabs tabPadding="md">
            <Tab label="笔记">
              <VStack spacing={0}>
                {notes.values.map((item) => {
                  return (
                    <NoteCard
                      note={item}
                      key={item.id}
                      onClick={() => navigate(`/doc/${item.id}/preview`)}
                    >
                      <Menu
                        control={
                          <ActionIcon>
                            <More />
                          </ActionIcon>
                        }
                      >
                        <Menu.Item
                          icon={<OpenDoor />}
                          onClick={() => {
                            navigate(`/doc/${item.id}/preview`);
                          }}
                        >
                          查看
                        </Menu.Item>
                        <Menu.Item
                          icon={<Editor />}
                          onClick={() => {
                            navigate(`/doc/${item.id}/edit`);
                          }}
                        >
                          编辑
                        </Menu.Item>
                        <Divider />
                        <Menu.Item
                          icon={<Move />}
                          onClick={() => {
                            setMove(item);
                          }}
                        >
                          移动
                        </Menu.Item>
                        <Divider />
                        <Menu.Item
                          icon={<CopyLink />}
                          onClick={() => {
                            navigator.clipboard.writeText(
                              link("share", item.id)
                            );
                          }}
                        >
                          复制分享链接
                        </Menu.Item>
                        <Menu.Item
                          icon={<Copy />}
                          onClick={() => {
                            navigator.clipboard.writeText(item.id);
                          }}
                        >
                          复制页面 ID
                        </Menu.Item>
                        <Divider />
                        <Menu.Item
                          icon={<BoxIcon />}
                          color="orange"
                          onClick={() => {
                            notes.$archiveNote(item.id);
                          }}
                        >
                          归档
                        </Menu.Item>
                        <Menu.Item
                          icon={<Delete />}
                          color="red"
                          onClick={() => {
                            notes.$deleteNote(item.id);
                          }}
                        >
                          删除
                        </Menu.Item>
                      </Menu>
                    </NoteCard>
                  );
                })}
                {notes.data && (
                  <Pagination
                    total={notes.data.pages}
                    page={notes.page}
                    onChange={notes.setPage}
                    position="center"
                    css={css`
                      margin-top: ${th.spacing(2)};
                      margin-bottom: ${th.spacing(4)};
                    `}
                  />
                )}
              </VStack>
            </Tab>
          </Tabs>
        </Async>
      </Container>
      <Omnibar
        opened={!!move}
        onClose={() => setMove(null)}
        placeholder="移动到..."
        onSelect={(note) => {
          if (move) {
            notes.$moveNote(move.id, note.workspace, note.id);
          }
          setMove(null);
        }}
      />
    </AppShellContainer>
  );
};

export default Workspace;
