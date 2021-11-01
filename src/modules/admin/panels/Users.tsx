import React, { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Container,
  Modal,
  Pagination,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core";
import { css } from "@emotion/react";
import NHeader from "../../../layout/header/NHeader";
import ColorModeButton from "../../../layout/header/ColorModeButton";
import { HStack, VStack } from "../../../components/layout/Stack";
import Box from "../../../components/layout/Box";
import { useTh } from "../../../theme/hooks/use-th";
import useSWR from "swr";
import {
  adminDeleteUser,
  adminListUsers,
  adminUpdateUser,
  UpdateUser,
} from "../../../api/admin";
import { User } from "../../../api/ums";
import Async from "../../../components/Async";
import BaseTable, {
  AutoResizer,
  ColumnShape,
  SortOrder,
} from "react-base-table";
import "react-base-table/styles.css";
import useToast from "../../../utils/use-toast";
import AuthorizeView from "../../../router/AuthorizeView";
import useForm from "../../../utils/use-form";
import { Submit } from "../../ums/form";

const Users: React.FC = () => {
  const th = useTh();
  const toast = useToast();
  const edit = useForm({
    initial: {
      id: "",
      username: "",
      password: "",
      nickname: "",
      email: "",
    },
  });
  const [page, setPage] = useState(1);
  const query = useSWR(["adminListUsers", page], (key, page) =>
    adminListUsers({ page })
  );
  const data = useMemo(() => query.data?.data, [query.data]);
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
        cellRenderer: (p) => (
          <Badge variant="dot" color={p.cellData ? "green" : "red"}>
            {p.cellData ? "启用" : "禁用"}
          </Badge>
        ),
        resizable: true,
        sortable: true,
      },
      {
        key: "createdTime",
        title: "注册时间",
        dataKey: "createdTime",
        width: 200,
        resizable: true,
        sortable: true,
      },
      {
        key: "operate",
        title: "操作",
        width: 200,
        frozen: "right",
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
    []
  );
  const [sort, setSort] = useState<Record<React.Key, SortOrder>>({});
  return (
    <Box
      css={css`
        width: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      <NHeader>
        <div />
        <HStack spacing="xs" align="center">
          <ColorModeButton />
        </HStack>
      </NHeader>
      <Container
        size="lg"
        css={css`
          width: 100%;
          margin-top: ${th.spacing(10)};
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        `}
      >
        <Title
          order={1}
          css={css`
            font-weight: 500;
          `}
        >
          用户列表
        </Title>
        <Async query={query}>
          {data && (
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
                    data={data.records}
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
                    }}
                  />
                )}
              </AutoResizer>
            </Box>
          )}
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
        </Async>
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
                onChange={(e) =>
                  edit.setValue("username", e.currentTarget.value)
                }
                error={edit.errors.username}
              />
              <TextInput
                label="昵称"
                placeholder="昵称"
                value={edit.values.nickname}
                onChange={(e) =>
                  edit.setValue("nickname", e.currentTarget.value)
                }
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
                onChange={(e) =>
                  edit.setValue("password", e.currentTarget.value)
                }
                error={edit.errors.password}
              />
              <Submit loading={edit.loading}>提交</Submit>
            </VStack>
          </form>
        </Modal>
      </Container>
    </Box>
  );
};

export default Users;
