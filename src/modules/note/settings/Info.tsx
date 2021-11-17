import React, { ChangeEvent } from "react";
import AppShellContainer from "../../../components/app-shell/AppShellContainer";
import AppShellHeader from "../../../components/app-shell/AppShellHeader";
import { HStack } from "../../../components/layout/Stack";
import ColorModeButton from "../../../components/header/ColorModeButton";
import Panel from "../../../components/Panel";
import AuthorizeView from "../../../router/AuthorizeView";
import useToast from "../../../utils/use-toast";
import useForm from "../../../utils/use-form";
import {
  sendUpdateEmailCode,
  updateEmail,
  updateName,
  updatePassword,
  updateUserInfo,
} from "../../../api/ums";
import {
  Avatar,
  Button,
  Input,
  InputWrapper,
  PasswordInput,
  Tab,
  Tabs,
  TextInput,
} from "@mantine/core";
import Form from "../../../components/form/Form";
import VerifyCodeInput from "../../../components/form/VerifyCodeInput";
import { Link } from "../../../components/Link";
import { Dropzone } from "@mantine/dropzone";

const Info: React.FC = () => {
  const toast = useToast();
  return (
    <AppShellContainer>
      <AppShellHeader>
        <div />
        <HStack spacing="xs" align="center">
          <ColorModeButton />
        </HStack>
      </AppShellHeader>
      <Panel title="基本资料">
        <AuthorizeView>
          {(user) => {
            if (!user) {
              return null;
            }
            const name = useForm({
              initial: {
                username: user.username,
                nickname: user.nickname,
              },
              handleSubmit: (values, loading) => {
                loading(
                  updateName(values)
                    .then(
                      toast.api.success({
                        title: "修改成功",
                      })
                    )
                    .catch(
                      toast.api.error({
                        title: "修改失败",
                      })
                    )
                );
              },
            });
            const email = useForm({
              initial: {
                code: "",
                email: user.email,
              },
              validate: {
                email: (value) => value.length > 0 || "邮箱必须不为空",
                code: (value) => value.length > 0 || "请先获取验证码",
              },
              handleSubmit: (values, loading) => {
                loading(
                  updateEmail(values)
                    .then(
                      toast.api.success({
                        title: "修改成功",
                      })
                    )
                    .catch(
                      toast.api.error({
                        title: "修改失败",
                      })
                    )
                );
              },
            });
            const password = useForm({
              initial: {
                oldPassword: "",
                newPassword: "",
              },
              validate: {
                oldPassword: (value) => value.length > 0 || "必须输入旧密码",
                newPassword: (value) => value.length > 0 || "新密码必须不为空",
              },
              handleSubmit: (values, loading) => {
                loading(
                  updatePassword(values)
                    .then(
                      toast.api.success({
                        title: "修改成功",
                      })
                    )
                    .catch(
                      toast.api.error({
                        title: "修改失败",
                      })
                    )
                );
              },
            });
            const info = useForm({
              initial: {
                ...user.info,
              },
              handleSubmit: (values, loading) => {
                loading(
                  updateUserInfo(values)
                    .then(
                      toast.api.success({
                        title: "修改成功",
                      })
                    )
                    .catch(
                      toast.api.error({
                        title: "修改失败",
                      })
                    )
                );
              },
            });
            return (
              <Tabs tabPadding="md">
                <Tab label="个人信息">
                  <Form onSubmit={info.onSubmit}>
                    <InputWrapper label="头像" error={info.errors.avatar}>
                      <HStack>
                        <Dropzone onDrop={(files) => console.log(files)}>
                          {(status) => (
                            <Avatar
                              size="xl"
                              src={info.values.avatar ?? undefined}
                              alt="Change avatar"
                            />
                          )}
                        </Dropzone>
                        <Input
                          value={info.values.avatar ?? undefined}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            info.setValue("avatar", e.currentTarget.value)
                          }
                        />
                      </HStack>
                    </InputWrapper>
                    <TextInput
                      label="简介"
                      placeholder="简介"
                      value={info.values.bio ?? undefined}
                      onChange={(e) =>
                        info.setValue("bio", e.currentTarget.value)
                      }
                      error={info.errors.bio}
                    />
                    <TextInput
                      label="链接"
                      placeholder="链接"
                      value={info.values.url ?? undefined}
                      onChange={(e) =>
                        info.setValue("url", e.currentTarget.value)
                      }
                      error={info.errors.url}
                    />
                    <TextInput
                      label="地址"
                      placeholder="地址"
                      value={info.values.address ?? undefined}
                      onChange={(e) =>
                        info.setValue("address", e.currentTarget.value)
                      }
                      error={info.errors.address}
                    />
                    <TextInput
                      label="公司"
                      placeholder="公司"
                      value={info.values.company ?? undefined}
                      onChange={(e) =>
                        info.setValue("company", e.currentTarget.value)
                      }
                      error={info.errors.company}
                    />
                    <TextInput
                      label="状态"
                      placeholder="状态"
                      value={info.values.status ?? undefined}
                      onChange={(e) =>
                        info.setValue("status", e.currentTarget.value)
                      }
                      error={info.errors.status}
                    />
                    <Button type="submit" loading={info.loading}>
                      更新
                    </Button>
                  </Form>
                </Tab>
                <Tab label="用户名/昵称">
                  <Form onSubmit={name.onSubmit}>
                    <TextInput
                      label="用户名"
                      placeholder="用户名"
                      value={name.values.username}
                      onChange={(e) =>
                        name.setValue("username", e.currentTarget.value)
                      }
                      error={name.errors.username}
                    />
                    <TextInput
                      label="昵称"
                      placeholder="昵称"
                      value={name.values.nickname}
                      onChange={(e) =>
                        name.setValue("nickname", e.currentTarget.value)
                      }
                      error={name.errors.nickname}
                    />
                    <Button type="submit" loading={name.loading}>
                      更新
                    </Button>
                  </Form>
                </Tab>
                <Tab label="邮箱">
                  <Form onSubmit={email.onSubmit}>
                    <TextInput
                      label="邮箱"
                      placeholder="邮箱"
                      value={email.values.email}
                      onChange={(e) =>
                        email.setValue("email", e.currentTarget.value)
                      }
                      error={email.errors.email}
                    />
                    <VerifyCodeInput
                      value={email.values.code}
                      onChange={(e) =>
                        email.setValue("code", e.currentTarget.value)
                      }
                      error={email.errors.code}
                      sendCode={() => {
                        if (!email.values.email) {
                          toast.def.error({
                            title: "邮箱不能为空",
                            message: "请先输入邮箱再发送验证码",
                          });
                          return;
                        }
                        return sendUpdateEmailCode(email.values.email);
                      }}
                    />
                    <Button type="submit" loading={email.loading}>
                      更新
                    </Button>
                  </Form>
                </Tab>
                <Tab label="密码">
                  <Form onSubmit={password.onSubmit}>
                    <PasswordInput
                      label={
                        <>
                          旧密码
                          <Link to="/reset-password" size="xs" ml="xs">
                            不记得旧密码？
                          </Link>
                        </>
                      }
                      placeholder="旧密码"
                      value={password.values.oldPassword}
                      onChange={(e) =>
                        password.setValue("oldPassword", e.currentTarget.value)
                      }
                      error={password.errors.oldPassword}
                    />
                    <PasswordInput
                      label="新密码"
                      placeholder="新密码"
                      value={password.values.newPassword}
                      onChange={(e) =>
                        password.setValue("newPassword", e.currentTarget.value)
                      }
                      error={password.errors.newPassword}
                    />
                    <Button type="submit" loading={password.loading}>
                      更新
                    </Button>
                  </Form>
                </Tab>
              </Tabs>
            );
          }}
        </AuthorizeView>
      </Panel>
    </AppShellContainer>
  );
};

export default Info;
