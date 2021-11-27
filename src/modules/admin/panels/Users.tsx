import React, { useMemo } from "react";
import {
  Badge,
  Button,
  Loader,
  Modal,
  MultiSelect,
  Pagination,
  PasswordInput,
  Switch,
  TextInput,
} from "@mantine/core";
import { css } from "@emotion/react";
import ColorModeButton from "../../../components/header/ColorModeButton";
import { HStack, VStack } from "../../../components/layout/Stack";
import Box from "../../../components/layout/Box";
import { AddUserView, UpdateUserView } from "../../../api/admin";
import { UserView } from "../../../api/ums";
import BaseTable, { AutoResizer, ColumnShape } from "react-base-table";
import useToast from "../../../utils/use-toast";
import AuthorizeView from "../../../router/AuthorizeView";
import useForm from "../../../utils/use-form";
import Panel from "../../../components/panel/Panel";
import { wrap } from "../../../utils/react";
import { Search } from "@icon-park/react";
import AppShellContainer from "../../../components/app-shell/AppShellContainer";
import AppShellHeader from "../../../components/app-shell/AppShellHeader";
import Form from "../../../components/form/Form";
import { useModals } from "@mantine/modals";
import useUsers from "../../../api/use-users";
import useRoles from "../../../api/use-roles";

const Users: React.FC = () => {
  const toast = useToast();
  // users & data
  const users = useUsers();
  const roles = useRoles();
  // edit form
  const edit = useForm<UpdateUserView>({
    initial: {
      id: 0,
      username: "",
      password: "",
      nickname: "",
      email: "",
    },
    handleSubmit: (values, loading) => {
      loading(
        users
          .$updateUser({
            id: values.id,
            username: values.username || undefined,
            password: values.password || undefined,
            nickname: values.nickname || undefined,
            email: values.email || undefined,
          })
          .then(() => edit.close())
      );
    },
  });
  const assignRole = useForm<{ id: number; roles: string[] }>({
    initial: {
      id: 0,
      roles: [],
    },
    handleSubmit: (values, loading) => {
      loading(
        users
          .$updateUserRole(values.id, values.roles)
          .then(() => assignRole.close())
      );
    },
  });
  const add = useForm<AddUserView>({
    initial: {
      username: "",
      password: "",
      email: "",
      nickname: "",
      status: true,
    },
    validate: {
      username: (value) => value.length > 0 || "用户名/邮箱必须不为空",
      password: (value) => value.length > 0 || "密码必须不为空",
      email: (value) =>
        /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
          value
        ) || "请输入正确的邮箱",
      nickname: (value) => value.length > 0 || "昵称必须不为空",
    },
    handleSubmit: (values, loading) => {
      loading(users.$addUser(values).then(() => add.close()));
    },
  });
  // users table
  const columns = useMemo<ColumnShape<UserView>[]>(
    () => [
      {
        key: "id",
        title: "ID",
        dataKey: "id",
        width: 200,
        resizable: true,
        sortable: true,
      },
      {
        key: "username",
        title: "用户名",
        dataKey: "username",
        width: 200,
        resizable: true,
        sortable: true,
      },
      {
        key: "nickname",
        title: "昵称",
        dataKey: "nickname",
        width: 200,
        resizable: true,
        sortable: true,
      },
      {
        key: "email",
        title: "邮箱",
        dataKey: "email",
        width: 200,
        resizable: true,
        sortable: true,
      },
      {
        key: "status",
        title: "状态",
        dataKey: "status",
        width: 200,
        resizable: true,
        sortable: true,
        cellRenderer: wrap(({ cellData }) => (
          <Badge variant="dot" color={cellData ? "green" : "red"}>
            {cellData ? "启用" : "禁用"}
          </Badge>
        )),
      },
      {
        key: "createdTime",
        title: "注册时间",
        dataKey: "createdTime",
        width: 200,
        resizable: true,
        sortable: true,
        cellRenderer: wrap(({ cellData }) => (
          <>{new Date(cellData).toLocaleString()}</>
        )),
      },
      {
        key: "operate",
        title: "操作",
        width: 270,
        frozen: "right",
        resizable: true,
        cellRenderer: wrap(({ rowData }) => {
          return (
            <AuthorizeView>
              {(user) => {
                const modals = useModals();
                return (
                  <HStack spacing={1}>
                    <Button
                      size="xs"
                      disabled={!!user && user.id === rowData.id}
                      onClick={() => {
                        users.$updateUser({
                          id: rowData.id,
                          status: !rowData.status,
                        });
                      }}
                    >
                      {rowData.status ? "禁用" : "启用"}
                    </Button>
                    <Button
                      size="xs"
                      onClick={() =>
                        edit.open({
                          id: rowData.id,
                          username: rowData.username,
                          password: "",
                          nickname: rowData.nickname,
                          email: rowData.email,
                        })
                      }
                    >
                      编辑
                    </Button>
                    <Button
                      size="xs"
                      onClick={() =>
                        assignRole.open({
                          id: rowData.id,
                          roles: rowData.roles.map((role) => role.name),
                        })
                      }
                    >
                      分配角色
                    </Button>
                    <Button
                      size="xs"
                      disabled={!!user && user.id === rowData.id}
                      color="red"
                      onClick={() => {
                        modals.openConfirmModal({
                          title: "确认删除该用户？",
                          labels: {
                            confirm: "确认删除",
                            cancel: "取消删除",
                          },
                          confirmProps: {
                            color: "red",
                          },
                          onConfirm: () => {
                            users.$deleteUser(rowData.id);
                          },
                        });
                      }}
                    >
                      删除
                    </Button>
                  </HStack>
                );
              }}
            </AuthorizeView>
          );
        }),
      },
    ],
    [toast, users, edit, assignRole]
  );
  return (
    <AppShellContainer>
      <AppShellHeader>
        <div />
        <HStack spacing="xs" align="center">
          <TextInput
            aria-label="搜索用户"
            placeholder="搜索用户"
            size="xs"
            icon={<Search />}
            value={users.search}
            onChange={(e) => users.setSearch(e.currentTarget.value)}
            rightSection={
              !users.error && !users.data ? <Loader size="xs" /> : <div />
            }
          />
          <Button size="xs" onClick={() => add.open()}>
            新增用户
          </Button>
          <ColorModeButton />
        </HStack>
      </AppShellHeader>
      <Panel title="用户列表">
        <VStack spacing={2} wrapChildren={false} grow={1}>
          <Box
            css={css`
              flex: 1;
            `}
          >
            <AutoResizer>
              {(size) => (
                <BaseTable
                  fixed
                  width={size.width}
                  height={size.height}
                  columns={columns}
                  data={users.values()}
                  sortState={users.sort}
                  onColumnSort={({ key, order }) => {
                    const newSort = {
                      ...users.sort,
                      [key]: order,
                    };
                    if (users.sort?.[key] === "desc") {
                      delete newSort[key];
                    }
                    users.setSort(newSort);
                    users.mutate();
                  }}
                />
              )}
            </AutoResizer>
          </Box>
          {users.data && (
            <Pagination
              total={users.data.pages}
              page={users.page}
              onChange={users.setPage}
              position="center"
            />
          )}
        </VStack>
      </Panel>
      <Modal opened={add.opened} onClose={() => add.close()} title="新增用户">
        <Form onSubmit={add.onSubmit}>
          <TextInput
            required
            label="用户名"
            placeholder="用户名"
            value={add.values.username}
            onChange={(e) => add.setValue("username", e.currentTarget.value)}
            error={add.errors.username}
          />
          <TextInput
            required
            label="昵称"
            placeholder="昵称"
            value={add.values.nickname}
            onChange={(e) => add.setValue("nickname", e.currentTarget.value)}
            error={add.errors.nickname}
          />
          <TextInput
            required
            label="邮箱"
            placeholder="邮箱"
            value={add.values.email}
            onChange={(e) => add.setValue("email", e.currentTarget.value)}
            error={add.errors.email}
          />
          <PasswordInput
            required
            label="密码"
            placeholder="密码"
            value={add.values.password}
            onChange={(e) => add.setValue("password", e.currentTarget.value)}
            error={add.errors.password}
          />
          <Switch
            label="状态"
            checked={add.values.status}
            onChange={(e) => add.setValue("status", e.currentTarget.checked)}
          />
          <Button type="submit" fullWidth loading={add.loading}>
            提交
          </Button>
        </Form>
      </Modal>
      <Modal
        opened={edit.opened}
        onClose={() => edit.close()}
        title={`编辑用户: ${edit.values.id}`}
      >
        <Form onSubmit={edit.onSubmit}>
          <TextInput
            label="用户名"
            placeholder="用户名"
            value={edit.values.username}
            onChange={(e) => edit.setValue("username", e.currentTarget.value)}
            error={edit.errors.username}
          />
          <TextInput
            label="昵称"
            placeholder="昵称"
            value={edit.values.nickname}
            onChange={(e) => edit.setValue("nickname", e.currentTarget.value)}
            error={edit.errors.nickname}
          />
          <TextInput
            label="邮箱"
            placeholder="邮箱"
            value={edit.values.email}
            onChange={(e) => edit.setValue("email", e.currentTarget.value)}
            error={edit.errors.email}
          />
          <PasswordInput
            label="密码"
            placeholder="密码"
            value={edit.values.password}
            onChange={(e) => edit.setValue("password", e.currentTarget.value)}
            error={edit.errors.password}
          />
          <Button type="submit" fullWidth loading={edit.loading}>
            提交
          </Button>
        </Form>
      </Modal>
      <Modal
        opened={assignRole.opened}
        onClose={() => assignRole.close()}
        title={`分配角色: ${assignRole.values.id}`}
      >
        <Form onSubmit={assignRole.onSubmit}>
          <MultiSelect
            label="角色"
            placeholder="选择角色"
            searchable
            data={
              roles.values().map((role) => role.name) ?? assignRole.values.roles
            }
            value={assignRole.values.roles}
            onChange={(value) => assignRole.setValue("roles", value)}
          />
          <Button type="submit" fullWidth loading={assignRole.loading}>
            提交
          </Button>
        </Form>
      </Modal>
    </AppShellContainer>
  );
};

export default Users;
