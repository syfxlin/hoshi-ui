import React from "react";
import useForm from "../../utils/use-form";
import useToast from "../../utils/use-toast";
import useCountDown from "../../utils/use-count-down";
import {
  resetPassword,
  ResetPasswordData,
  sendResetPasswordCode,
} from "../../api/ums";
import { history } from "../../store/history";
import Header from "../../components/header/Header";
import Main from "../../components/Main";
import FluidCenter from "../../components/layout/FluidCenter";
import { Card, LinkGroup, Submit, Title } from "./form";
import { ActionIcon, PasswordInput, TextInput, Tooltip } from "@mantine/core";
import { TwoDimensionalCode } from "@icon-park/react";
import { BLink } from "../../components/Link";
import { VStack } from "../../components/layout/Stack";

const ResetPassword: React.FC = () => {
  const toast = useToast();
  const form = useForm({
    initial: {
      code: "",
      email: "",
      password: "",
    },
    validate: {
      code: (value) => value.length > 0 || "请先获取验证码",
      password: (value) => value.length > 0 || "密码必须不为空",
      email: (value) =>
        /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
          value
        ) || "请输入正确的邮箱",
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
    sendResetPasswordCode(form.values.email)
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
  const onSubmit = (data: ResetPasswordData) => {
    resetPassword(data)
      .then(
        toast.api.success({
          title: "重置密码成功",
        })
      )
      .then(() => history.push("/login"))
      .catch(
        toast.api.error({
          title: "重置密码失败",
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
            <form onSubmit={form.onSubmit(onSubmit)}>
              <VStack>
                <TextInput
                  required
                  label="邮箱"
                  placeholder="你的邮箱"
                  value={form.values.email}
                  onChange={(e) =>
                    form.setValue("email", e.currentTarget.value)
                  }
                  error={form.errors.email}
                />
                <PasswordInput
                  required
                  label="密码"
                  placeholder="你的密码（新密码）"
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
                <Submit>重置密码</Submit>
              </VStack>
            </form>
            <LinkGroup>
              <BLink variant="link" to="/login">
                登录
              </BLink>
              <BLink variant="link" to="/register">
                注册
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

export default ResetPassword;
