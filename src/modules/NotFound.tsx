import React from "react";
import Header from "../components/header/Header";
import Main from "../components/Main";
import FluidCenter from "../components/layout/FluidCenter";
import { HStack } from "../components/layout/Stack";
import { Divider, Text, Title } from "@mantine/core";
import { css } from "@emotion/react";

const NotFound: React.FC = () => {
  return (
    <>
      <Header />
      <Main>
        <FluidCenter>
          <HStack wrapChildren={false} align="center">
            <Title
              order={2}
              css={css`
                font-weight: 500;
                text-align: center;
              `}
            >
              404
            </Title>
            <Divider orientation="vertical" />
            <Text
              size="md"
              css={css`
                font-weight: 500;
                text-align: center;
              `}
            >
              很抱歉，你要访问的页面不存在
            </Text>
          </HStack>
        </FluidCenter>
      </Main>
    </>
  );
};

export default NotFound;
