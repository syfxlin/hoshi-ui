import React from "react";
import AppShellContainer from "../../../components/app-shell/AppShellContainer";
import AppShellHeader from "../../../components/app-shell/AppShellHeader";
import { HStack, VStack } from "../../../components/layout/Stack";
import ColorModeButton from "../../../components/header/ColorModeButton";
import { useTh } from "../../../theme/hooks/use-th";
import { useNavigate } from "react-router-dom";
import { useWorkspaces } from "../../../api/use-workspaces";
import { css } from "@emotion/react";
import {
  ActionIcon,
  Container,
  Divider,
  Menu,
  Tab,
  Tabs,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { Emoji } from "emoji-mart-virtualized";
import Async from "../../../components/Async";
import Ellipsis from "../../../components/Ellipsis";
import { Copy, Delete, More, OpenDoor } from "@icon-park/react";

const Home: React.FC = () => {
  const th = useTh();
  // route
  const navigate = useNavigate();

  // workspace
  const workspaces = useWorkspaces(false);

  return (
    <AppShellContainer>
      <AppShellHeader>
        <div />
        <HStack spacing="xs" align="center">
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
            emoji="package"
          />
        </ActionIcon>
        <Title
          order={1}
          css={css`
            font-weight: 500;
            margin-bottom: ${th.spacing(4)};
          `}
        >
          工作区
        </Title>
        <Async query={workspaces}>
          <Tabs tabPadding="md">
            <Tab label="笔记">
              <VStack spacing={0}>
                {workspaces.values
                  .filter((item) => item.parent === 0)
                  .map((item) => {
                    return (
                      <HStack
                        key={`workspace-${item.id}`}
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
                            emoji={item.data?.icon || "spiral_note_pad"}
                          />
                        </ThemeIcon>
                        <VStack
                          spacing={1}
                          onClick={() => navigate(`/workspace/${item.id}`)}
                          css={css`
                            flex-grow: 1;
                            overflow-x: hidden;
                          `}
                        >
                          <Ellipsis weight={500}>{item.data?.name}</Ellipsis>
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
                              <strong>创建时间：</strong>
                              <span>
                                {item.data?.createdTime &&
                                  new Date(
                                    item.data.createdTime
                                  ).toLocaleString()}
                              </span>
                            </Ellipsis>
                          </HStack>
                        </VStack>
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
                              navigate(`/workspace/${item.id}`);
                            }}
                          >
                            查看
                          </Menu.Item>
                          <Divider />
                          <Menu.Item
                            icon={<Copy />}
                            onClick={() => {
                              navigator.clipboard.writeText(item.id as string);
                            }}
                          >
                            复制工作区 ID
                          </Menu.Item>
                          <Divider />
                          <Menu.Item
                            icon={<Delete />}
                            color="red"
                            onClick={() => {
                              workspaces.$deleteWorkspace(item.id as string);
                            }}
                          >
                            删除
                          </Menu.Item>
                        </Menu>
                      </HStack>
                    );
                  })}
              </VStack>
            </Tab>
          </Tabs>
        </Async>
      </Container>
    </AppShellContainer>
  );
};

export default Home;
