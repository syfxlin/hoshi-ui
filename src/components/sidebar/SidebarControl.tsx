import React, { forwardRef } from "react";
import { Avatar, Text, UnstyledButton } from "@mantine/core";
import Stack from "../layout/Stack";
import { css } from "@emotion/react";
import Box from "../layout/Box";
import { Down } from "@icon-park/react";
import AuthorizeView from "../../router/AuthorizeView";
import { useTh } from "../../theme/hooks/use-th";
import { UnstyledButtonProps } from "@mantine/core/lib/src/components/Button/UnstyledButton/UnstyledButton";
import { Assign } from "../../utils/types";

type SidebarControlProps = Assign<
  UnstyledButtonProps,
  {
    icon?: React.ReactNode;
    text?: React.ReactNode;
  }
>;

const SidebarControl = forwardRef<HTMLButtonElement, SidebarControlProps>(
  ({ icon, text, ...props }, ref) => {
    const th = useTh();
    return (
      <UnstyledButton
        {...props}
        ref={ref}
        css={css`
          width: 100%;
        `}
      >
        <AuthorizeView>
          {(user) =>
            user && (
              <Stack
                align="center"
                css={css`
                  margin: ${th.spacing(2)};
                  padding: ${th.spacing(2)} ${th.spacing(3)};
                  border-radius: ${th.radius("sm")};

                  &:hover {
                    background-color: ${th.color("gray.2", "gray.7")};
                  }
                `}
                styles={{
                  spacing: css`
                    &:nth-of-type(2) {
                      flex-grow: 1;
                      min-width: 0;
                    }
                  `,
                }}
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
                    {text ?? user.username}
                  </Text>
                </Box>
                {icon ?? <Down />}
              </Stack>
            )
          }
        </AuthorizeView>
      </UnstyledButton>
    );
  }
);

export default SidebarControl;