import React, { useMemo, useState } from "react";
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
import { useTh } from "../../../theme/hooks/use-th";
import useSWR from "swr";
import {
  adminAddUser,
  adminDeleteUser,
  adminListRoles,
  adminListUsers,
  adminUpdateUser,
  adminUpdateUserRole,
  UpdateUserView,
} from "../../../api/admin";
import { UserView } from "../../../api/ums";
import BaseTable, {
  AutoResizer,
  ColumnShape,
  SortOrder,
} from "react-base-table";
import useToast from "../../../utils/use-toast";
import AuthorizeView from "../../../router/AuthorizeView";
import useForm from "../../../utils/use-form";
import Panel from "../../../components/Panel";
import { wrap } from "../../../utils/react";
import { Search } from "@icon-park/react";
import { useDebouncedValue } from "@mantine/hooks";
import AppShellContainer from "../../../components/app-shell/AppShellContainer";
import AppShellHeader from "../../../components/app-shell/AppShellHeader";
import Form from "../../../components/form/Form";
import { useModals } from "@mantine/modals";

const Users: React.FC = () => {
  const th = useTh();
  const toast = useToast();
  // query params
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<Record<React.Key, SortOrder>>({});
  const [search, setSearch] = useState("");
  const [debounced] = useDebouncedValue(search, 1000);
  // query & data
  const query = useSWR(
    ["adminListUsers", page, sort, debounced],
    (key, page, sort, search) =>
      adminListUsers(
        {
          page,
          sort,
        },
        search === "" ? undefined : search
      )
  );
  const data = useMemo(() => query.data?.data, [query.data]);
  const roles = useSWR(["adminListRoles"], () => adminListRoles());
  // edit form
  const edit = useForm({
    initial: {
      id: 0,
      username: "",
      password: "",
      nickname: "",
      email: "",
    },
    handleSubmit: (values, loading) => {
      const user: UpdateUserView = {};
      if (values.username !== "") {
        user.username = values.username;
      }
      if (values.password !== "") {
        user.password = values.password;
      }
      if (values.nickname !== "") {
        user.nickname = values.nickname;
      }
      if (values.email !== "") {
        user.email = values.email;
      }
      loading(
        adminUpdateUser(values.id, user)
          .then(
            toast.api.success({
              title: "修改成功",
            })
          )
          .then(() => query.mutate())
          .then(() => edit.reset())
          .catch(
            toast.api.error({
              title: "修改失败",
            })
          )
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
        adminUpdateUserRole(values.id, values.roles)
          .then(
            toast.api.success({
              title: "修改成功",
            })
          )
          .then(() => query.mutate())
          .then(() => assignRole.reset())
          .catch(
            toast.api.error({
              title: "修改失败",
            })
          )
      );
    },
  });
  const add = useForm({
    initial: {
      opened: false,
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleSubmit: ({ opened, ...user }, loading) => {
      loading(
        adminAddUser(user)
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
                        adminUpdateUser(rowData.id, { status: !rowData.status })
                          .then(
                            toast.api.success({
                              title: "操作成功",
                            })
                          )
                          .then(() => query.mutate())
                          .catch(
                            toast.api.error({
                              title: "操作失败",
                            })
                          );
                      }}
                    >
                      {rowData.status ? "禁用" : "启用"}
                    </Button>
                    <Button
                      size="xs"
                      onClick={() =>
                        edit.setValues({
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
                        assignRole.setValues({
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
                            adminDeleteUser(rowData.id)
                              .then(
                                toast.api.success({
                                  title: "删除成功",
                                })
                              )
                              .then(() => query.mutate())
                              .catch(
                                toast.api.error({
                                  title: "删除失败",
                                })
                              );
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
    [toast, query, edit, assignRole]
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
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            rightSection={
              !query.error && !query.data ? <Loader size="xs" /> : <div />
            }
          />
          <Button size="xs" onClick={() => add.setValue("opened", true)}>
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
                  data={data?.records}
                  sortState={sort}
                  onColumnSort={({ key, order }) => {
                    const newSort = {
                      ...sort,
                      [key]: order,
                    };
                    if (sort?.[key] === "desc") {
                      delete newSort[key];
                    }
                    setSort(newSort);
                    query.mutate();
                  }}
                />
              )}
            </AutoResizer>
          </Box>
          {data && (
            <Pagination
              total={data.pages}
              page={page}
              onChange={setPage}
              position="center"
            />
          )}
        </VStack>
      </Panel>
      <Modal
        opened={add.values.opened}
        onClose={() => add.reset()}
        title="新增用户"
      >
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
        opened={edit.values.id !== 0}
        onClose={() => edit.reset()}
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
        opened={assignRole.values.id !== 0}
        onClose={() => assignRole.reset()}
        title={`分配角色: ${assignRole.values.id}`}
      >
        <Form onSubmit={assignRole.onSubmit}>
          <MultiSelect
            label="角色"
            placeholder="选择角色"
            searchable
            data={
              roles.data?.data?.map((role) => role.name) ??
              assignRole.values.roles
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
