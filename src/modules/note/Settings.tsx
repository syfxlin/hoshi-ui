import React, { ChangeEvent } from "react";
import AppShell from "../../components/app-shell/AppShell";
import Sidebar from "../../components/sidebar/Sidebar";
import { HStack, VStack } from "../../components/layout/Stack";
import ColorModeButton from "../../components/header/ColorModeButton";
import AppShellContainer from "../../components/app-shell/AppShellContainer";
import AppShellHeader from "../../components/app-shell/AppShellHeader";
import SidebarControl from "../../components/sidebar/SidebarControl";
import { Left, TwoDimensionalCode } from "@icon-park/react";
import { history } from "../../store/history";
import Panel from "../../components/Panel";
import AuthorizeView from "../../router/AuthorizeView";
import useForm from "../../utils/use-form";
import Form from "../../components/Form";
import {
  ActionIcon,
  Avatar,
  Button,
  Divider,
  Input,
  InputWrapper,
  PasswordInput,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { UpdateUser } from "../../api/admin";
import useCountDown from "../../utils/use-count-down";
import { Link } from "../../components/Link";
import { Dropzone } from "@mantine/dropzone";

const Settings: React.FC = () => {
  return (
    <AppShell>
      <Sidebar>
        <SidebarControl
          icon={<Left />}
          text="返回应用"
          onClick={() => history.push("/dashboard/home")}
        />
      </Sidebar>
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
              });
              const [timeout, setTimeout] = useCountDown();
              const email = useForm({
                initial: {
                  code: "",
                  email: user.email,
                },
              });
              const password = useForm({
                initial: {
                  oldPassword: "",
                  newPassword: "",
                },
              });
              const info = useForm({
                initial: {
                  ...user.info,
                },
              });
              return (
                <VStack spacing={4} divider={<Divider />}>
                  <Form
                    onSubmit={name.onSubmit((values) => {
                      const update: UpdateUser = {};
                      if (values.username !== "") {
                        update.username = values.username;
                      }
                      if (values.nickname !== "") {
                        update.nickname = values.nickname;
                      }
                      name.setLoading(true);
                    })}
                  >
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
                  <Form>
                    <TextInput
                      label="邮箱"
                      placeholder="邮箱"
                      value={email.values.email}
                      onChange={(e) =>
                        email.setValue("email", e.currentTarget.value)
                      }
                      error={email.errors.email}
                    />
                    <TextInput
                      label="验证码"
                      placeholder={
                        timeout === 0
                          ? "点击右侧图标获取验证码"
                          : `重新发送 (${timeout} 秒)`
                      }
                      value={email.values.code}
                      onChange={(e) =>
                        email.setValue("code", e.currentTarget.value)
                      }
                      error={email.errors.code}
                      rightSection={
                        <ActionIcon onClick={() => setTimeout(60)}>
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
                    <Button type="submit" loading={email.loading}>
                      更新
                    </Button>
                  </Form>
                  <Form>
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
                    <Button type="submit" loading={email.loading}>
                      更新
                    </Button>
                  </Form>
                  <Form>
                    <InputWrapper label="头像" error={info.errors.avatar}>
                      <HStack>
                        <Dropzone onDrop={(files) => console.log(files)}>
                          {(status) => (
                            <Avatar
                              size="xl"
                              src={info.values.avatar}
                              alt="Change avatar"
                            />
                          )}
                        </Dropzone>
                        <Input
                          value={info.values.avatar}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            info.setValue("avatar", e.currentTarget.value)
                          }
                        />
                      </HStack>
                    </InputWrapper>
                    <TextInput
                      label="简介"
                      placeholder="简介"
                      value={info.values.bio}
                      onChange={(e) =>
                        info.setValue("bio", e.currentTarget.value)
                      }
                      error={info.errors.bio}
                    />
                    <TextInput
                      label="链接"
                      placeholder="链接"
                      value={info.values.url}
                      onChange={(e) =>
                        info.setValue("url", e.currentTarget.value)
                      }
                      error={info.errors.url}
                    />
                    <TextInput
                      label="地址"
                      placeholder="地址"
                      value={info.values.address}
                      onChange={(e) =>
                        info.setValue("address", e.currentTarget.value)
                      }
                      error={info.errors.address}
                    />
                    <TextInput
                      label="公司"
                      placeholder="公司"
                      value={info.values.company}
                      onChange={(e) =>
                        info.setValue("company", e.currentTarget.value)
                      }
                      error={info.errors.company}
                    />
                    <TextInput
                      label="状态"
                      placeholder="状态"
                      value={info.values.status}
                      onChange={(e) =>
                        info.setValue("status", e.currentTarget.value)
                      }
                      error={info.errors.status}
                    />
                    <Button type="submit" loading={info.loading}>
                      更新
                    </Button>
                  </Form>
                </VStack>
              );
            }}
          </AuthorizeView>
        </Panel>
      </AppShellContainer>
    </AppShell>
  );
};

export default Settings;
