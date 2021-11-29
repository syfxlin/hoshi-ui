import React from "react";
import { logout, UserView } from "../../api/ums";
import { BLink } from "../Link";
import { Avatar, Divider, Menu } from "@mantine/core";
import { Home, Logout } from "@icon-park/react";
import Stack from "../layout/Stack";
import { css } from "@emotion/react";
import useMe from "../../api/use-me";
import Box from "../layout/Box";
import { useNavigate } from "react-router-dom";

const AuthButton: React.FC = () => {
  const navigate = useNavigate();
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
      <Box
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        <Menu
          withArrow
          placement="end"
          control={
            <Avatar
              size="sm"
              src={user.info.avatar ?? undefined}
              alt={`${user.nickname}'s avatar`}
              css={css`
                border-radius: 50%;
              `}
            />
          }
        >
          <Menu.Item
            icon={<Home />}
            onClick={() => navigate(`/dashboard/home`)}
          >
            工作台
          </Menu.Item>
          <Divider />
          <Menu.Item color="red" icon={<Logout />} onClick={logout}>
            登出
          </Menu.Item>
        </Menu>
      </Box>
    );
  };

  return me.data ? authorize(me.data) : anonymous;
};

export default AuthButton;
