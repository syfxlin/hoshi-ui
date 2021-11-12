import React from "react";
import AppShellHeader from "../../../components/app-shell/AppShellHeader";
import { HStack, VStack } from "../../../components/layout/Stack";
import ColorModeButton from "../../../components/header/ColorModeButton";
import Panel from "../../../components/Panel";
import AppShellContainer from "../../../components/app-shell/AppShellContainer";
import useSWR from "swr";
import { listTokens, revokeToken } from "../../../api/ums";
import Async from "../../../components/Async";
import { Button, Divider, Text } from "@mantine/core";
import { css } from "@emotion/react";
import useToast from "../../../utils/use-toast";
import useLoading from "../../../utils/use-loading";
import SubTitle from "../SubTitle";
import { useTh } from "../../../theme/hooks/use-th";

const Tokens: React.FC = () => {
  const query = useSWR(["listTokens"], () => listTokens());
  const toast = useToast();
  const loading = useLoading();
  const th = useTh();
  return (
    <AppShellContainer>
      <AppShellHeader>
        <div />
        <HStack spacing="xs" align="center">
          <ColorModeButton />
        </HStack>
      </AppShellHeader>
      <Panel title="API 令牌">
        <Async query={query}>
          <SubTitle>令牌</SubTitle>
          <VStack
            divider={<Divider />}
            css={css`
              margin-top: ${th.spacing(4)};
            `}
          >
            {query.data?.data?.map((token) => {
              const onRevoke = () => {
                loading.wrap(
                  revokeToken(token.token)
                    .then(
                      toast.api.success({
                        title: "撤销成功",
                      })
                    )
                    .then(() => query.mutate())
                    .catch(
                      toast.api.error({
                        title: "撤销失败",
                      })
                    )
                );
              };
              return (
                <HStack
                  key={token.token}
                  css={css`
                    width: 100%;
                    align-items: center;
                  `}
                  styles={{
                    spacing: css`
                      &:nth-of-type(1) {
                        flex-grow: 1;
                      }
                    `,
                  }}
                >
                  <HStack spacing={1}>
                    <Text weight={500}>{token.name}</Text>
                    <Text>-</Text>
                    <Text>{token.token}</Text>
                  </HStack>
                  <Button
                    variant="light"
                    loading={loading.loading}
                    onClick={onRevoke}
                  >
                    撤销
                  </Button>
                </HStack>
              );
            })}
          </VStack>
        </Async>
      </Panel>
    </AppShellContainer>
  );
};

export default Tokens;
