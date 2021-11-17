import React from "react";
import FluidCenter from "../../components/layout/FluidCenter";
import { PasswordInput, TextInput } from "@mantine/core";
import { BLink } from "../../components/Link";
import { Card, LinkGroup, Submit, Title } from "./form";
import useForm from "../../utils/use-form";
import useToast from "../../utils/use-toast";
import Main from "../../components/Main";
import Header from "../../components/header/Header";
import Form from "../../components/form/Form";
import { login } from "../../api/ums";

const Login: React.FC = () => {
  const toast = useToast();
  const form = useForm({
    initial: {
      username: "",
      password: "",
      remember: true,
    },
    validate: {
      username: (value) => value.length > 0 || "用户名/邮箱必须不为空",
      password: (value) => value.length > 0 || "密码必须不为空",
    },
    handleSubmit: (values, loading) => {
      loading(
        login(values).catch(
          toast.api.error({
            title: "登录失败",
          })
        )
      );
    },
  });
  return (
    <>
      <Header />
      <Main>
        <FluidCenter>
          <Card>
            <Title>Hoshi-Note</Title>
            <Form onSubmit={form.onSubmit}>
              <TextInput
                required
                label="用户名/邮箱"
                placeholder="你的用户名或邮箱"
                value={form.values.username}
                onChange={(e) =>
                  form.setValue("username", e.currentTarget.value)
                }
                error={form.errors.username}
              />
              <PasswordInput
                required
                label="密码"
                placeholder="你的密码"
                value={form.values.password}
                onChange={(e) =>
                  form.setValue("password", e.currentTarget.value)
                }
                error={form.errors.password}
              />
              <Submit loading={form.loading}>登录</Submit>
            </Form>
            <LinkGroup>
              <BLink variant="link" to="/register">
                快速注册
              </BLink>
              <BLink variant="link" to="/reset-password">
                找回密码
              </BLink>
              <BLink variant="link" to="/help">
                遇到问题
              </BLink>
            </LinkGroup>
          </Card>
        </FluidCenter>
      </Main>
    </>
  );
};

export default Login;
