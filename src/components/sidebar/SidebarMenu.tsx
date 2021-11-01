import React from "react";
import { useTh } from "../../theme/hooks/use-th";
import { Avatar, Menu, MenuProps, Text, UnstyledButton } from "@mantine/core";
import { css } from "@emotion/react";
import AuthorizeView from "../../router/AuthorizeView";
import Stack from "../layout/Stack";
import Box from "../layout/Box";
import { Down } from "@icon-park/react";

const SidebarMenu: React.FC<MenuProps> = ({ children, ...props }) => {
  const th = useTh();
  return (
    <Menu
      withArrow
      placement="center"
      {...props}
      control={
        <UnstyledButton
          css={css`
            width: 100%;
          `}
        >
          <AuthorizeView>
            {(user) =>
              user && (
                <Stack
                  align="center"
                  childStyles={{
                    1: {
                      flexGrow: 1,
                      minWidth: 0,
                    },
                  }}
                  css={css`
                    margin: ${th.spacing(2)};
                    padding: ${th.spacing(2)} ${th.spacing(3)};
                    border-radius: ${th.radius("sm")};

                    &:hover {
                      background-color: ${th.color("gray.2", "gray.7")};
                    }
                  `}
                >
                  <Avatar
                    src={user.info.avatar}
                    alt={`${user.nickname}'s avatar`}
                    css={css`
                      border-radius: 50%;
                    `}
                  />
                  <Box>
                    <Text
                      css={css`
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow-x: hidden;
                      `}
                    >
                      {user.nickname}
                    </Text>
                    <Text
                      size="xs"
                      color="gray"
                      css={css`
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow-x: hidden;
                      `}
                    >
                      {user.username}
                    </Text>
                  </Box>
                  <Down />
                </Stack>
              )
            }
          </AuthorizeView>
        </UnstyledButton>
      }
      css={css`
        display: block !important;
      `}
    >
      {children}
    </Menu>
  );
};

export default SidebarMenu;
