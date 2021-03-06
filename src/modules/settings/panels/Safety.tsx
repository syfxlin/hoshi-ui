import React from "react";
import AppShellContainer from "../../../components/app-shell/AppShellContainer";
import AppShellHeader from "../../../components/app-shell/AppShellHeader";
import { HStack, VStack } from "../../../components/layout/Stack";
import ColorModeButton from "../../../components/header/ColorModeButton";
import Panel from "../../../components/panel/Panel";
import Async from "../../../components/Async";
import { Button, Divider, Tab, Tabs, ThemeIcon } from "@mantine/core";
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
import useLogged from "../../../api/use-logged";
import Ellipsis from "../../../components/Ellipsis";
import { Helmet } from "react-helmet";

const Safety: React.FC = () => {
  const logged = useLogged();
  const loading = useLoading();
  return (
    <AppShellContainer>
      <Helmet>
        <title>设置：账号安全 - Hoshi-Note</title>
      </Helmet>
      <AppShellHeader>
        <div />
        <HStack spacing="xs" align="center">
          <ColorModeButton />
        </HStack>
      </AppShellHeader>
      <Panel title="账号安全">
        <Tabs tabPadding="md">
          <Tab label="已登录的设备">
            <Async query={logged}>
              <VStack divider={<Divider />}>
                {logged.values.map((item) => {
                  const ua = UAParser(item.userAgent);
                  const icons = {
                    console: <Terminal />,
                    mobile: <Iphone />,
                    tablet: <IpadOne />,
                    smarttv: <Tv />,
                    wearable: <IwatchTwo />,
                    embedded: <Cpu />,
                    desktop: <Computer />,
                  } as Record<string, React.ReactElement>;
                  return (
                    <HStack
                      key={item.sessionId}
                      wrapChildren={false}
                      css={css`
                        width: 100%;
                        align-items: center;
                      `}
                    >
                      <ThemeIcon variant="light" size="xl">
                        {icons[ua.device.type ?? "desktop"]}
                      </ThemeIcon>
                      <VStack
                        spacing={1}
                        css={css`
                          flex-grow: 1;
                          overflow-x: hidden;
                        `}
                      >
                        <Ellipsis weight={500}>
                          {item.address} - {item.sessionId}
                        </Ellipsis>
                        <Ellipsis color="dimmed" size="xs">
                          <span>
                            {ua.browser.name && ua.os.name
                              ? `${ua.browser.name} on ${ua.os.name}`
                              : "未知设备"}
                          </span>
                          <span>，</span>
                          <span>
                            登录时间：
                            {new Date(item.creationTime).toLocaleString()}
                          </span>
                          <span>，</span>
                          <span>
                            最后访问时间：
                            {new Date(item.lastAccessedTime).toLocaleString()}
                          </span>
                        </Ellipsis>
                      </VStack>
                      <Button
                        variant="light"
                        disabled={item.current}
                        loading={loading.loading}
                        onClick={() =>
                          loading.wrap(logged.$exclude(item.sessionId))
                        }
                      >
                        删除
                      </Button>
                    </HStack>
                  );
                })}
              </VStack>
            </Async>
          </Tab>
        </Tabs>
      </Panel>
    </AppShellContainer>
  );
};

export default Safety;
