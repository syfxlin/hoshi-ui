import React from "react";
import useForm from "../../utils/use-form";
import { register, sendRegisterCode } from "../../api/ums";
import FluidCenter from "../../components/layout/FluidCenter";
import { Card, LinkGroup, Submit, Title } from "./form";
import { ActionIcon, PasswordInput, TextInput, Tooltip } from "@mantine/core";
import { BLink } from "../../components/Link";
import { TwoDimensionalCode } from "@icon-park/react";
import useToast from "../../utils/use-toast";
import Main from "../../components/Main";
import Header from "../../components/header/Header";
import { history } from "../../store/history";
import useCountDown from "../../utils/use-count-down";
import Form from "../../components/form/Form";

const Register: React.FC = () => {
  const toast = useToast();
  const form = useForm({
    initial: {
      code: "",
      username: "",
      password: "",
      email: "",
      nickname: "",
    },
    validate: {
      code: (value) => value.length > 0 || "请先获取验证码",
      username: (value) => value.length > 0 || "用户名/邮箱必须不为空",
      password: (value) => value.length > 0 || "密码必须不为空",
      email: (value) =>
        /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
          value
        ) || "请输入正确的邮箱",
      nickname: (value) => value.length > 0 || "昵称必须不为空",
    },
    handleSubmit: (values, loading) => {
      loading(
        register(values)
          .then(
            toast.api.success({
              title: "注册成功",
            })
          )
          .then(() => history.push("/login"))
          .catch(
            toast.api.error({
              title: "注册失败",
            })
          )
      );
    },
  });
  const [timeout, setTimeout] = useCountDown();
  const sendValidCode = () => {
    if (!form.values.email) {
      toast.def.error({
        title: "邮箱不能为空",
        message: "请先输入邮箱再发送验证码",
      });
      return;
    }
    if (timeout > 0) {
      toast.def.error({
        title: "验证码发送过于频繁",
        message: "请等待一分钟后再发送",
      });
      return;
    }
    sendRegisterCode(form.values.email)
      .then(
        toast.api.success({
          title: "发送验证码成功",
        })
      )
      .then(() => setTimeout(60))
      .catch(
        toast.api.error({
          title: "发送验证码失败",
        })
      );
  };
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
                label="昵称"
                placeholder="你的昵称"
                value={form.values.nickname}
                onChange={(e) =>
                  form.setValue("nickname", e.currentTarget.value)
                }
                error={form.errors.nickname}
              />
              <TextInput
                required
                label="邮箱"
                placeholder="你的邮箱"
                value={form.values.email}
                onChange={(e) => form.setValue("email", e.currentTarget.value)}
                error={form.errors.email}
              />
              <TextInput
                required
                label="用户名"
                placeholder="你的用户名"
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
              <TextInput
                required
                label="验证码"
                placeholder={
                  timeout === 0
                    ? "点击右侧图标获取验证码"
                    : `重新发送 (${timeout} 秒)`
                }
                value={form.values.code}
                onChange={(e) => form.setValue("code", e.currentTarget.value)}
                error={form.errors.code}
                rightSection={
                  <ActionIcon onClick={() => sendValidCode()}>
                    <Tooltip
                      label={
                        timeout === 0
                          ? "点击发送验证码"
                          : `重新发送 (${timeout} 秒)`
                      }
                      withArrow
                    >
                      <TwoDimensionalCode />
                    </Tooltip>
                  </ActionIcon>
                }
              />
              <Submit loading={form.loading}>注册</Submit>
            </Form>
            <LinkGroup>
              <BLink variant="link" to="/login">
                登录
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

export default Register;
