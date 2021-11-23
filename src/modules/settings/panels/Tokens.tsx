import React from "react";
import AppShellHeader from "../../../components/app-shell/AppShellHeader";
import { HStack, VStack } from "../../../components/layout/Stack";
import ColorModeButton from "../../../components/header/ColorModeButton";
import Panel from "../../../components/Panel";
import AppShellContainer from "../../../components/app-shell/AppShellContainer";
import useSWR from "swr";
import { addToken, listTokens, revokeToken } from "../../../api/ums";
import Async from "../../../components/Async";
import {
  Button,
  Divider,
  Modal,
  Tab,
  Tabs,
  Text,
  TextInput,
} from "@mantine/core";
import { css } from "@emotion/react";
import useToast from "../../../utils/use-toast";
import useLoading from "../../../utils/use-loading";
import useForm from "../../../utils/use-form";
import Form from "../../../components/form/Form";

const Tokens: React.FC = () => {
  const query = useSWR(["listTokens"], () => listTokens());
  const toast = useToast();
  const loading = useLoading();
  const add = useForm({
    initial: {
      opened: false,
      name: "",
    },
    validate: {
      name: (value) => value.length > 0 || "令牌名称必须不为空",
    },
    handleSubmit: (values, loading) => {
      loading(
        addToken(values.name)
          .then(
            toast.api.success({
              title: "新增成功",
            })
          )
          .then(() => query.mutate())
          .then(() => add.reset())
          .catch(
            toast.api.error({
              title: "新增失败",
            })
          )
      );
    },
  });
  return (
    <AppShellContainer>
      <AppShellHeader>
        <div />
        <HStack spacing="xs" align="center">
          <Button size="xs" onClick={() => add.setValue("opened", true)}>
            新增令牌
          </Button>
          <ColorModeButton />
        </HStack>
      </AppShellHeader>
      <Panel title="API 令牌">
        <Tabs tabPadding="md">
          <Tab label="令牌">
            <Async query={query}>
              <VStack divider={<Divider />}>
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
                      wrapChildren={false}
                      css={css`
                        width: 100%;
                        align-items: center;
                      `}
                    >
                      <HStack
                        spacing={1}
                        css={css`
                          flex-grow: 1;
                        `}
                      >
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
          </Tab>
        </Tabs>
      </Panel>
      <Modal
        opened={add.values.opened}
        onClose={() => add.reset()}
        title="新增令牌"
      >
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
