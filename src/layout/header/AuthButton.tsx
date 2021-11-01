import React from "react";
import { useLogout, User } from "../../api/ums";
import { BLink } from "../../components/Link";
import AuthorizeView from "../../router/AuthorizeView";
import { Avatar, Divider, Menu, Text } from "@mantine/core";
import { Logout } from "@icon-park/react";
import Stack from "../../components/layout/Stack";
import { css } from "@emotion/react";

const AuthButton: React.FC = () => {
  const logout = useLogout();
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
  const authorize = (user: User) => {
    return (
      <>
        <Menu
          control={
            <Avatar
              src={user.info.avatar}
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
  return (
    <AuthorizeView>
      {(user) => (user ? authorize(user) : anonymous)}
    </AuthorizeView>
  );
};

export default AuthButton;
