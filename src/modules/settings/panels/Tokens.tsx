import React from "react";
import AppShellHeader from "../../../components/app-shell/AppShellHeader";
import { HStack, VStack } from "../../../components/layout/Stack";
import ColorModeButton from "../../../components/header/ColorModeButton";
import Panel from "../../../components/panel/Panel";
import AppShellContainer from "../../../components/app-shell/AppShellContainer";
import Async from "../../../components/Async";
import { Button, Divider, Modal, Tab, Tabs, TextInput } from "@mantine/core";
import { css } from "@emotion/react";
import useLoading from "../../../utils/use-loading";
import useForm from "../../../utils/use-form";
import Form from "../../../components/form/Form";
import useTokens from "../../../api/use-tokens";
import Ellipsis from "../../../components/Ellipsis";
import { Helmet } from "react-helmet";

const Tokens: React.FC = () => {
  const tokens = useTokens();
  const loading = useLoading();
  const add = useForm<{ name: string }>({
    initial: {
      name: "",
    },
    validate: {
      name: (value) => value.length > 0 || "令牌名称必须不为空",
    },
    handleSubmit: (values, loading) => {
      loading(tokens.$addToken(values.name).then(() => add.close()));
    },
  });
  return (
    <AppShellContainer>
      <Helmet>
        <title>设置：API 令牌 - Hoshi-Note</title>
      </Helmet>
      <AppShellHeader>
        <div />
        <HStack spacing="xs" align="center">
          <Button size="xs" onClick={() => add.open()}>
            新增令牌
          </Button>
          <ColorModeButton />
        </HStack>
      </AppShellHeader>
      <Panel title="API 令牌">
        <Tabs tabPadding="md">
          <Tab label="令牌">
            <Async query={tokens}>
              <VStack divider={<Divider />}>
                {tokens.values.map((token) => {
                  const onRevoke = () => {
                    loading.wrap(tokens.$revokeToken(token.token));
                  };
                  return (
                    <HStack
                      key={token.token}
                      wrapChildren={false}
                      css={css`
                        width: 100%;
                        align-items: center;
                      `}
                    >
                      <HStack
                        spacing={1}
                        wrapChildren={false}
                        css={css`
                          flex-grow: 1;
                          overflow-x: hidden;
                        `}
                      >
                        <Ellipsis weight={500}>{token.name}</Ellipsis>
                        <span>-</span>
                        <Ellipsis>{token.token}</Ellipsis>
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
          </Tab>
        </Tabs>
      </Panel>
      <Modal opened={add.opened} onClose={() => add.close()} title="新增令牌">
        <Form onSubmit={add.onSubmit}>
          <TextInput
            label="令牌名称"
            placeholder="令牌名称"
            value={add.values.name}
            onChange={(e) => add.setValue("name", e.currentTarget.value)}
            error={add.errors.name}
          />
          <Button type="submit" fullWidth loading={add.loading}>
            提交
          </Button>
        </Form>
      </Modal>
    </AppShellContainer>
  );
};

export default Tokens;
