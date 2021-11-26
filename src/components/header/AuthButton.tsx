import React from "react";
import { logout, UserView } from "../../api/ums";
import { BLink } from "../Link";
import { Avatar, Divider, Menu, Text } from "@mantine/core";
import { Logout } from "@icon-park/react";
import Stack from "../layout/Stack";
import { css } from "@emotion/react";
import useMe from "../../api/use-me";

const AuthButton: React.FC = () => {
  const me = useMe();

  const anonymous = (
    <>
      <Stack spacing="xs">
        <BLink size="xs" variant="light" to="/login">
          登录
        </BLink>
        <BLink size="xs" to="/register">
          注册
        </BLink>
      </Stack>
    </>
  );
  const authorize = (user: UserView) => {
    return (
      <>
        <Menu
          control={
            <Avatar
              src={user.info.avatar ?? undefined}
              alt={`${user.nickname}'s avatar`}
              css={css`
                border-radius: 50%;
              `}
            />
          }
          withArrow
        >
          <Menu.Label>Application</Menu.Label>
          <Menu.Item>Settings</Menu.Item>
          <Menu.Item>Messages</Menu.Item>
          <Menu.Item>Gallery</Menu.Item>
          <Menu.Item
            rightSection={
              <Text size="xs" color="gray">
                ⌘K
              </Text>
            }
          >
            Search
          </Menu.Item>
          <Divider />
          <Menu.Label>Danger zone</Menu.Label>
          <Menu.Item>Transfer my data</Menu.Item>,
          <Menu.Item color="red" icon={<Logout />} onClick={logout}>
            登出
          </Menu.Item>
        </Menu>
      </>
    );
  };

  return me.data ? authorize(me.data) : anonymous;
};

export default AuthButton;
