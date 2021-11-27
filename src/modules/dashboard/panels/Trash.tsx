import React from "react";
import AppShellContainer from "../../../components/app-shell/AppShellContainer";
import AppShellHeader from "../../../components/app-shell/AppShellHeader";
import ColorModeButton from "../../../components/header/ColorModeButton";
import { HStack, VStack } from "../../../components/layout/Stack";
import Panel from "../../../components/panel/Panel";
import Async from "../../../components/Async";
import {
  ActionIcon,
  Divider,
  Loader,
  Menu,
  Pagination,
  SegmentedControl,
  Tab,
  Tabs,
  TextInput,
} from "@mantine/core";
import NoteCard from "../../../components/panel/NoteCard";
import { useNavigate } from "react-router-dom";
import useTrash from "../../../api/use-trash";
import { css } from "@emotion/react";
import { useTh } from "../../../theme/hooks/use-th";
import { Delete, More, Search, Undo } from "@icon-park/react";

const Trash: React.FC = () => {
  const th = useTh();
  const trash = useTrash();
  const navigate = useNavigate();
  return (
    <AppShellContainer>
      <AppShellHeader>
        <div />
        <HStack spacing="xs" align="center">
          <SegmentedControl
            value={trash.sort[0]}
            onChange={(value) => trash.setSort([value, trash.sort[1]])}
            size="xs"
            data={[
              { label: "笔记名称", value: "name" },
              { label: "创建时间", value: "createdTime" },
              { label: "最后修改时间", value: "updatedTime" },
            ]}
          />
          <SegmentedControl
            value={trash.sort[1]}
            onChange={(value: "asc" | "desc") =>
              trash.setSort([trash.sort[0], value])
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
            value={trash.search}
            onChange={(e) => trash.setSearch(e.currentTarget.value)}
            rightSection={
              !trash.error && !trash.data ? <Loader size="xs" /> : <div />
            }
          />
          <ColorModeButton />
        </HStack>
      </AppShellHeader>
      <Panel title="回收站">
        <Async query={trash}>
          <Tabs tabPadding="md">
            <Tab label="笔记">
              <VStack spacing={0}>
                {trash.values()?.map((item) => {
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
                          icon={<Undo />}
                          onClick={() => trash.$restoreNote(item.id)}
                        >
                          还原笔记
                        </Menu.Item>
                        <Divider />
                        <Menu.Item
                          color="red"
                          icon={<Delete />}
                          onClick={() => trash.$forceDeleteNote(item.id)}
                        >
                          永久删除
                        </Menu.Item>
                      </Menu>
                    </NoteCard>
                  );
                })}
                {trash.data && (
                  <Pagination
                    total={trash.data.pages}
                    page={trash.page}
                    onChange={trash.setPage}
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
      </Panel>
    </AppShellContainer>
  );
};

export default Trash;
