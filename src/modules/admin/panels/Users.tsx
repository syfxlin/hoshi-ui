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
import { Helmet } from "react-helmet";

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
      username: (value) => value.length > 0 || "?????????/?????????????????????",
      password: (value) => value.length > 0 || "?????????????????????",
      email: (value) =>
        /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
          value
        ) || "????????????????????????",
      nickname: (value) => value.length > 0 || "?????????????????????",
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
        title: "?????????",
        dataKey: "username",
        width: 200,
        resizable: true,
        sortable: true,
      },
      {
        key: "nickname",
        title: "??????",
        dataKey: "nickname",
        width: 200,
        resizable: true,
        sortable: true,
      },
      {
        key: "email",
        title: "??????",
        dataKey: "email",
        width: 200,
        resizable: true,
        sortable: true,
      },
      {
        key: "status",
        title: "??????",
        dataKey: "status",
        width: 200,
        resizable: true,
        sortable: true,
        cellRenderer: wrap(({ cellData }) => (
          <Badge variant="dot" color={cellData ? "green" : "red"}>
            {cellData ? "??????" : "??????"}
          </Badge>
        )),
      },
      {
        key: "createdTime",
        title: "????????????",
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
        title: "??????",
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
                      {rowData.status ? "??????" : "??????"}
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
                      ??????
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
                      ????????????
                    </Button>
                    <Button
                      size="xs"
                      disabled={!!user && user.id === rowData.id}
                      color="red"
                      onClick={() => {
                        modals.openConfirmModal({
                          title: "????????????????????????",
                          labels: {
                            confirm: "????????????",
                            cancel: "????????????",
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
                      ??????
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
      <Helmet>
        <title>???????????? - Hoshi-Note ?????????</title>
      </Helmet>
      <AppShellHeader>
        <div />
        <HStack spacing="xs" align="center">
          <TextInput
            aria-label="????????????"
            placeholder="????????????"
            size="xs"
            icon={<Search />}
            value={users.search}
            onChange={(e) => users.setSearch(e.currentTarget.value)}
            rightSection={
              !users.error && !users.data ? <Loader size="xs" /> : <div />
            }
          />
          <Button size="xs" onClick={() => add.open()}>
            ????????????
          </Button>
          <ColorModeButton />
        </HStack>
      </AppShellHeader>
      <Panel title="????????????">
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
                  data={users.values}
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
      <Modal opened={add.opened} onClose={() => add.close()} title="????????????">
        <Form onSubmit={add.onSubmit}>
          <TextInput
            required
            label="?????????"
            placeholder="?????????"
            value={add.values.username}
            onChange={(e) => add.setValue("username", e.currentTarget.value)}
            error={add.errors.username}
          />
          <TextInput
            required
            label="??????"
            placeholder="??????"
            value={add.values.nickname}
            onChange={(e) => add.setValue("nickname", e.currentTarget.value)}
            error={add.errors.nickname}
          />
          <TextInput
            required
            label="??????"
            placeholder="??????"
            value={add.values.email}
            onChange={(e) => add.setValue("email", e.currentTarget.value)}
            error={add.errors.email}
          />
          <PasswordInput
            required
            label="??????"
            placeholder="??????"
            value={add.values.password}
            onChange={(e) => add.setValue("password", e.currentTarget.value)}
            error={add.errors.password}
          />
          <Switch
            label="??????"
            checked={add.values.status}
            onChange={(e) => add.setValue("status", e.currentTarget.checked)}
          />
          <Button type="submit" fullWidth loading={add.loading}>
            ??????
          </Button>
        </Form>
      </Modal>
      <Modal
        opened={edit.opened}
        onClose={() => edit.close()}
        title={`????????????: ${edit.values.id}`}
      >
        <Form onSubmit={edit.onSubmit}>
          <TextInput
            label="?????????"
            placeholder="?????????"
            value={edit.values.username}
            onChange={(e) => edit.setValue("username", e.currentTarget.value)}
            error={edit.errors.username}
          />
          <TextInput
            label="??????"
            placeholder="??????"
            value={edit.values.nickname}
            onChange={(e) => edit.setValue("nickname", e.currentTarget.value)}
            error={edit.errors.nickname}
          />
          <TextInput
            label="??????"
            placeholder="??????"
            value={edit.values.email}
            onChange={(e) => edit.setValue("email", e.currentTarget.value)}
            error={edit.errors.email}
          />
          <PasswordInput
            label="??????"
            placeholder="??????"
            value={edit.values.password}
            onChange={(e) => edit.setValue("password", e.currentTarget.value)}
            error={edit.errors.password}
          />
          <Button type="submit" fullWidth loading={edit.loading}>
            ??????
          </Button>
        </Form>
      </Modal>
      <Modal
        opened={assignRole.opened}
        onClose={() => assignRole.close()}
        title={`????????????: ${assignRole.values.id}`}
      >
        <Form onSubmit={assignRole.onSubmit}>
          <MultiSelect
            label="??????"
            placeholder="????????????"
            searchable
            data={
              roles.values.map((role) => role.name) ?? assignRole.values.roles
            }
            value={assignRole.values.roles}
            onChange={(value) => assignRole.setValue("roles", value)}
          />
          <Button type="submit" fullWidth loading={assignRole.loading}>
            ??????
          </Button>
        </Form>
      </Modal>
    </AppShellContainer>
  );
};

export default Users;
