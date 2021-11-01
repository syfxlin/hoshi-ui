import React, { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Modal,
  MultiSelect,
  Pagination,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { css } from "@emotion/react";
import ColorModeButton from "../../../components/header/ColorModeButton";
import { HStack, VStack } from "../../../components/layout/Stack";
import Box from "../../../components/layout/Box";
import { useTh } from "../../../theme/hooks/use-th";
import useSWR from "swr";
import {
  adminDeleteUser,
  adminListRoles,
  adminListUsers,
  adminUpdateUser,
  adminUpdateUserRole,
  UpdateUser,
} from "../../../api/admin";
import { User } from "../../../api/ums";
import BaseTable, {
  AutoResizer,
  ColumnShape,
  SortOrder,
} from "react-base-table";
import useToast from "../../../utils/use-toast";
import AuthorizeView from "../../../router/AuthorizeView";
import useForm from "../../../utils/use-form";
import { Submit } from "../../ums/form";
import AppShell from "../../../components/app-shell/AppShell";
import Panel from "../Panel";

const Users: React.FC = () => {
  const th = useTh();
  const toast = useToast();
  // query params
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<Record<React.Key, SortOrder>>({});
  // query & data
  const query = useSWR(["adminListUsers", page, sort], (key, page, sort) =>
    adminListUsers({
      page,
      sort: Object.entries(sort).map(([property, direction]) => ({
        property,
        direction,
      })) as any,
    })
  );
  const data = useMemo(() => query.data?.data, [query.data]);
  const roles = useSWR(["adminListRoles"], () => adminListRoles());
  // edit form
  const edit = useForm({
    initial: {
      id: "",
      username: "",
      password: "",
      nickname: "",
      email: "",
    },
  });
  const assignRole = useForm<{ id: string; roles: string[] }>({
    initial: {
      id: "",
      roles: [],
    },
  });
  // users table
  const columns = useMemo<ColumnShape<User>[]>(
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
        cellRenderer: ({ cellData }) => (
          <Badge variant="dot" color={cellData ? "green" : "red"}>
            {cellData ? "启用" : "禁用"}
          </Badge>
        ),
      },
      {
        key: "createdTime",
        title: "注册时间",
        dataKey: "createdTime",
        width: 200,
        resizable: true,
        sortable: true,
        cellRenderer: ({ cellData }) => new Date(cellData).toLocaleString(),
      },
      {
        key: "operate",
        title: "操作",
        width: 200,
        frozen: "right",
        resizable: true,
        cellRenderer: ({ rowData }) => {
          return (
            <AuthorizeView>
              {(user) => {
                const [forceDelete, setForceDelete] = useState(false);
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
                      分配权限
                    </Button>
                    <Button
                      size="xs"
                      disabled={!!user && user.id === rowData.id}
                      color="red"
                      onClick={() => {
                        if (!forceDelete) {
                          setForceDelete(true);
                          setTimeout(() => setForceDelete(false), 5000);
                        } else {
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
                        }
                      }}
                    >
                      {forceDelete ? "确认删除？" : "删除"}
                    </Button>
                  </HStack>
                );
              }}
            </AuthorizeView>
          );
        },
      },
    ],
    [toast, query, edit, assignRole]
  );
  return (
    <AppShell.Container
      header={
        <>
          <div />
          <HStack spacing="xs" align="center">
            <ColorModeButton />
          </HStack>
        </>
      }
    >
      <Panel title="用户列表">
        <Box
          css={css`
            flex: 1;
            margin-top: ${th.spacing(4)};
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
                  if (sort[key] === "desc") {
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
            css={css`
              margin-top: ${th.spacing(2)};
              margin-bottom: ${th.spacing(4)};
            `}
          />
        )}
      </Panel>
      <Modal
        opened={edit.values.id !== ""}
        onClose={() => edit.reset()}
        title={`编辑用户: ${edit.values.id}`}
      >
        <form
          onSubmit={edit.onSubmit((values) => {
            const user: UpdateUser = {};
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
            edit.setLoading(true);
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
              .finally(() => edit.setLoading(false));
          })}
        >
          <VStack>
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
            <Submit loading={edit.loading}>提交</Submit>
          </VStack>
        </form>
      </Modal>
      <Modal
        opened={assignRole.values.id !== ""}
        onClose={() => assignRole.reset()}
        title={`分配权限: ${assignRole.values.id}`}
      >
        <form
          onSubmit={assignRole.onSubmit((values) => {
            assignRole.setLoading(true);
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
              .finally(() => assignRole.setLoading(false));
          })}
        >
          <VStack>
            <MultiSelect
              label="权限"
              placeholder="选择权限"
              searchable
              data={
                roles.data?.data?.map((role) => role.name) ??
                assignRole.values.roles
              }
              value={assignRole.values.roles}
              onChange={(value) => assignRole.setValue("roles", value)}
            />
            <Submit loading={assignRole.loading}>提交</Submit>
          </VStack>
        </form>
      </Modal>
    </AppShell.Container>
  );
};

export default Users;
