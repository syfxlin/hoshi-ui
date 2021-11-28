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
import { css } from "@emotion/react";
import { useTh } from "../../../theme/hooks/use-th";
import { Delete, More, Search, Undo } from "@icon-park/react";
import useArchive from "../../../api/use-archive";

const Archive: React.FC = () => {
  const th = useTh();
  const archive = useArchive();
  const navigate = useNavigate();
  return (
    <AppShellContainer>
      <AppShellHeader>
        <div />
        <HStack spacing="xs" align="center">
          <SegmentedControl
            value={archive.sort[0]}
            onChange={(value) => archive.setSort([value, archive.sort[1]])}
            size="xs"
            data={[
              { label: "笔记名称", value: "name" },
              { label: "创建时间", value: "createdTime" },
              { label: "最后修改时间", value: "updatedTime" },
            ]}
          />
          <SegmentedControl
            value={archive.sort[1]}
            onChange={(value: "asc" | "desc") =>
              archive.setSort([archive.sort[0], value])
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
            value={archive.search}
            onChange={(e) => archive.setSearch(e.currentTarget.value)}
            rightSection={
              !archive.error && !archive.data ? <Loader size="xs" /> : <div />
            }
          />
          <ColorModeButton />
        </HStack>
      </AppShellHeader>
      <Panel title="回收站">
        <Async query={archive}>
          <Tabs tabPadding="md">
            <Tab label="笔记">
              <VStack spacing={0}>
                {archive.values.map((item) => {
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
                          onClick={() => archive.$restoreNote(item.id)}
                        >
                          还原笔记
                        </Menu.Item>
                        <Divider />
                        <Menu.Item
                          color="red"
                          icon={<Delete />}
                          onClick={() => archive.$deleteNote(item.id)}
                        >
                          删除
                        </Menu.Item>
                      </Menu>
                    </NoteCard>
                  );
                })}
                {archive.data && (
                  <Pagination
                    total={archive.data.pages}
                    page={archive.page}
                    onChange={archive.setPage}
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

export default Archive;
