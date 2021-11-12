import React from "react";
import AppShellContainer from "../../../components/app-shell/AppShellContainer";
import AppShellHeader from "../../../components/app-shell/AppShellHeader";
import { HStack, VStack } from "../../../components/layout/Stack";
import ColorModeButton from "../../../components/header/ColorModeButton";
import Panel from "../../../components/Panel";
import useSWR from "swr";
import { excludeLogged, listLogged } from "../../../api/ums";
import Async from "../../../components/Async";
import { Button, Divider, Text, ThemeIcon } from "@mantine/core";
import {
  Computer,
  Cpu,
  IpadOne,
  Iphone,
  IwatchTwo,
  Terminal,
  Tv,
} from "@icon-park/react";
import UAParser from "ua-parser-js";
import { css } from "@emotion/react";
import useLoading from "../../../utils/use-loading";
import useToast from "../../../utils/use-toast";
import SubTitle from "../SubTitle";
import { useTh } from "../../../theme/hooks/use-th";

const Safety: React.FC = () => {
  const query = useSWR(["listLogged"], () => listLogged());
  const loading = useLoading();
  const toast = useToast();
  const th = useTh();
  return (
    <AppShellContainer>
      <AppShellHeader>
        <div />
        <HStack spacing="xs" align="center">
          <ColorModeButton />
        </HStack>
      </AppShellHeader>
      <Panel title="账号安全">
        <Async query={query}>
          <SubTitle>已登录的设备</SubTitle>
          <VStack
            divider={<Divider />}
            css={css`
              margin-top: ${th.spacing(4)};
            `}
          >
            {query.data?.data?.map((logged) => {
              const ua = UAParser(logged.userAgent);
              const icons = {
                console: <Terminal />,
                mobile: <Iphone />,
                tablet: <IpadOne />,
                smarttv: <Tv />,
                wearable: <IwatchTwo />,
                embedded: <Cpu />,
                desktop: <Computer />,
              } as Record<string, React.ReactElement>;
              const onDelete = () => {
                loading.wrap(
                  excludeLogged(logged.sessionId)
                    .then(
                      toast.api.success({
                        title: "删除成功",
                      })
                    )
                    .then(() => query.mutate())
                    .catch(
                      toast.api.error({
                        title: "删除失败",
                      })
                    )
                );
              };
              return (
                <HStack
                  key={logged.sessionId}
                  css={css`
                    width: 100%;
                    align-items: center;
                  `}
                  styles={{
                    spacing: css`
                      &:nth-of-type(2) {
                        flex-grow: 1;
                      }
                    `,
                  }}
                >
                  <ThemeIcon variant="light" size="xl">
                    {icons[ua.device.type ?? "desktop"]}
                  </ThemeIcon>
                  <VStack spacing={1}>
                    <Text weight={500}>
                      {logged.address} - {logged.sessionId}
                    </Text>
                    <Text color="gray" size="xs">
                      <span>
                        {ua.browser.name && ua.os.name
                          ? `${ua.browser.name} on ${ua.os.name}`
                          : "未知设备"}
                        ，
                      </span>
                      <span>
                        登录时间：
                        {new Date(logged.creationTime).toLocaleString()}，
                      </span>
                      <span>
                        最后访问时间：
                        {new Date(logged.lastAccessedTime).toLocaleString()}
                      </span>
                    </Text>
                  </VStack>
                  <Button
                    variant="light"
                    disabled={logged.current}
                    loading={loading.loading}
                    onClick={onDelete}
                  >
                    删除
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

export default Safety;
