import React from "react";
import { Button, PasswordInput, TextInput } from "@mantine/core";
import { Link } from "../../components/Link";
import useForm from "../../utils/use-form";
import useToast from "../../utils/use-toast";
import Form from "../../components/form/Form";
import { login } from "../../api/ums";
import FormPage, { LinkGroup } from "./FormPage";

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
    <FormPage title="登录">
      <Form onSubmit={form.onSubmit}>
        <TextInput
          required
          label="用户名/邮箱"
          placeholder="你的用户名或邮箱"
          value={form.values.username}
          onChange={(e) => form.setValue("username", e.currentTarget.value)}
          error={form.errors.username}
        />
        <PasswordInput
          required
          label="密码"
          placeholder="你的密码"
          value={form.values.password}
          onChange={(e) => form.setValue("password", e.currentTarget.value)}
          error={form.errors.password}
        />
        <Button type="submit" loading={form.loading} fullWidth>
          登录
        </Button>
      </Form>
      <LinkGroup>
        <Link to="/register">快速注册</Link>
        <Link to="/reset-password">找回密码</Link>
        <Link to="/help">遇到问题</Link>
      </LinkGroup>
    </FormPage>
  );
};

export default Login;
