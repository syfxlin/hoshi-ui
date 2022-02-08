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
import { Copy, CopyLink, More, Search, Undo } from "@icon-park/react";
import useShares from "../../../api/use-shares";
import useMe from "../../../api/use-me";
import { link } from "../../../api/url";
import { Helmet } from "react-helmet";

const Shares: React.FC = () => {
  const th = useTh();
  const navigate = useNavigate();
  const me = useMe();
  const shares = useShares(me.data?.id as number);
  return (
    <AppShellContainer>
      <Helmet>
        <title>分享 - Hoshi-Note</title>
      </Helmet>
      <AppShellHeader>
        <div />
        <HStack spacing="xs" align="center">
          <SegmentedControl
            value={shares.sort[0]}
            onChange={(value) => shares.setSort([value, shares.sort[1]])}
            size="xs"
            data={[
              { label: "笔记名称", value: "name" },
              { label: "创建时间", value: "createdTime" },
              { label: "最后修改时间", value: "updatedTime" },
            ]}
          />
          <SegmentedControl
            value={shares.sort[1]}
            onChange={(value: "asc" | "desc") =>
              shares.setSort([shares.sort[0], value])
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
            value={shares.search}
            onChange={(e) => shares.setSearch(e.currentTarget.value)}
            rightSection={
              !shares.error && !shares.data ? <Loader size="xs" /> : <div />
            }
          />
          <ColorModeButton />
        </HStack>
      </AppShellHeader>
      <Panel title="分享">
        <Async query={shares}>
          <Tabs tabPadding="md">
            <Tab label="笔记">
              <VStack spacing={0}>
                {shares.values.map((item) => {
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
                          icon={<CopyLink />}
                          onClick={() =>
                            navigator.clipboard.writeText(
                              link("share", item.id)
                            )
                          }
                        >
                          复制分享链接
                        </Menu.Item>
                        <Menu.Item
                          icon={<Copy />}
                          onClick={() => navigator.clipboard.writeText(item.id)}
                        >
                          复制页面 ID
                        </Menu.Item>
                        <Divider />
                        <Menu.Item
                          icon={<Undo />}
                          onClick={() => shares.$cancelShare(item.id)}
                        >
                          取消分享
                        </Menu.Item>
                      </Menu>
                    </NoteCard>
                  );
                })}
                {shares.data && (
                  <Pagination
                    total={shares.data.pages}
                    page={shares.page}
                    onChange={shares.setPage}
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

export default Shares;
