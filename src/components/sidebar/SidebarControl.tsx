import React, { forwardRef } from "react";
import { Avatar, UnstyledButton, UnstyledButtonProps } from "@mantine/core";
import Stack from "../layout/Stack";
import { css } from "@emotion/react";
import Box from "../layout/Box";
import { Down } from "@icon-park/react";
import AuthorizeView from "../../router/AuthorizeView";
import { useTh } from "../../theme/hooks/use-th";
import { Assign } from "../../utils/types";
import Ellipsis from "../Ellipsis";

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
                wrapChildren={false}
                css={css`
                  margin: ${th.spacing(2)};
                  padding: ${th.spacing(2)} ${th.spacing(3)};
                  border-radius: ${th.radius("sm")};

                  &:hover {
                    background-color: ${th.color("gray.3", "gray.7")};
                  }
                `}
              >
                <Avatar
                  src={user.info.avatar ?? undefined}
                  alt={`${user.nickname}'s avatar`}
                  css={css`
                    border-radius: 50%;
                  `}
                />
                <Box
                  css={css`
                    flex-grow: 1;
                    min-width: 0;
                  `}
                >
                  <Ellipsis>{user.nickname}</Ellipsis>
                  <Ellipsis size="xs" color="dimmed">
                    {text ?? user.username}
                  </Ellipsis>
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
