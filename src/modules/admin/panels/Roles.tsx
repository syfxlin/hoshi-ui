import React, { useMemo } from "react";
import { useTh } from "../../../theme/hooks/use-th";
import useToast from "../../../utils/use-toast";
import useSWR from "swr";
import {
  AddRoleView,
  adminAddRole,
  adminDeleteRole,
  adminListRoles,
  adminUpdateRole,
  UpdateRoleView,
} from "../../../api/admin";
import BaseTable, { AutoResizer, ColumnShape } from "react-base-table";
import { RoleView } from "../../../api/ums";
import {
  Badge,
  Button,
  Modal,
  MultiSelect,
  Switch,
  TextInput,
} from "@mantine/core";
import { HStack } from "../../../components/layout/Stack";
import ColorModeButton from "../../../components/header/ColorModeButton";
import Panel from "../../../components/Panel";
import Box from "../../../components/layout/Box";
import { css } from "@emotion/react";
import useForm from "../../../utils/use-form";
import { wrap } from "../../../utils/react";
import { permissions } from "../../../api/permissions";
import AppShellContainer from "../../../components/app-shell/AppShellContainer";
import AppShellHeader from "../../../components/app-shell/AppShellHeader";
import Form from "../../../components/form/Form";
import { useModals } from "@mantine/modals";

const Roles: React.FC = () => {
  const th = useTh();
  const toast = useToast();
  // query & data
  const query = useSWR(["adminListRoles"], () => adminListRoles());
  const data = useMemo(() => query.data?.data, [query.data]);
  // form
  const add = useForm<{ opened: boolean } & AddRoleView>({
    initial: {
      opened: false,
      name: "",
      description: "",
      status: true,
      permissions: [],
    },
    validate: {
      name: (value) => value.length > 0 || "角色名称必须不为空",
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleSubmit: ({ opened, ...role }, loading) => {
      loading(
        adminAddRole(role)
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
  const edit = useForm<
    {
      name: string;
    } & UpdateRoleView
  >({
    initial: {
      name: "",
      description: "",
      permissions: [],
    },
    handleSubmit: (values, loading) => {
      const role: UpdateRoleView = {};
      if (values.description !== "") {
        role.description = values.description;
      }
      role.permissions = values.permissions;
      loading(
        adminUpdateRole(values.name, role)
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
  // roles table
  const columns = useMemo<ColumnShape<RoleView>[]>(
    () => [
      {
        key: "name",
        title: "名称",
        dataKey: "name",
        width: 200,
        resizable: true,
      },
      {
        key: "description",
        title: "描述",
        dataKey: "description",
        width: 200,
        resizable: true,
      },
      {
        key: "permissions",
        title: "权限",
        dataKey: "permissions",
        width: 200,
        resizable: true,
        cellRenderer: wrap(({ cellData }) => (
          <Box
            css={css`
              overflow-x: auto;
              white-space: nowrap;
            `}
          >
            {cellData
              .map(
                (p: string) =>
                  permissions.find((v) => v.value === p)?.label ?? p
              )
              .join(", ")}
          </Box>
        )),
      },
      {
        key: "status",
        title: "状态",
        dataKey: "status",
        width: 200,
        resizable: true,
        cellRenderer: wrap(({ cellData }) => (
          <Badge variant="dot" color={cellData ? "green" : "red"}>
            {cellData ? "启用" : "禁用"}
          </Badge>
        )),
      },
      {
        key: "createdTime",
        title: "创建时间",
        dataKey: "createdTime",
        width: 200,
        resizable: true,
        cellRenderer: wrap(({ cellData }) => (
          <>{new Date(cellData).toLocaleString()}</>
        )),
      },
      {
        key: "operate",
        title: "操作",
        width: 200,
        frozen: "right",
        resizable: true,
        cellRenderer: wrap(({ rowData }) => {
          const modals = useModals();
          return (
            <HStack spacing={1}>
              <Button
                size="xs"
                disabled={["USER", "ADMIN"].includes(rowData.name)}
                onClick={() => {
                  adminUpdateRole(rowData.name, { status: !rowData.status })
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
                    name: rowData.name,
                    description: rowData.description ?? "",
                    permissions: rowData.permissions ?? [],
                  })
                }
              >
                编辑
              </Button>
              <Button
                size="xs"
                color="red"
                disabled={["USER", "ADMIN"].includes(rowData.name)}
                onClick={() => {
                  modals.openConfirmModal({
                    title: "确认删除该权限？",
                    labels: {
                      confirm: "确认删除",
                      cancel: "取消删除",
                    },
                    confirmProps: {
                      color: "red",
                    },
                    onConfirm: () => {
                      adminDeleteRole(rowData.name)
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
        }),
      },
    ],
    [query, edit]
  );
  return (
    <AppShellContainer>
      <AppShellHeader>
        <div />
        <HStack spacing="xs" align="center">
          <Button size="xs" onClick={() => add.setValue("opened", true)}>
            新增角色
          </Button>
          <ColorModeButton />
        </HStack>
      </AppShellHeader>
      <Panel title="角色列表">
        <Box
          css={css`
            flex: 1;
            margin-bottom: ${th.spacing(4)};
          `}
        >
          <AutoResizer>
            {(size) => (
              <BaseTable
                fixed
                width={size.width}
                height={size.height}
                columns={columns}
                data={data}
                rowKey="name"
              />
            )}
          </AutoResizer>
        </Box>
      </Panel>
      <Modal
        opened={add.values.opened}
        onClose={() => add.reset()}
        title="新增角色"
      >
        <Form onSubmit={add.onSubmit}>
          <TextInput
            label="名称"
            placeholder="名称"
            value={add.values.name}
            onChange={(e) => add.setValue("name", e.currentTarget.value)}
            error={add.errors.name}
          />
          <TextInput
            label="描述"
            placeholder="描述"
            value={add.values.description ?? ""}
            onChange={(e) => add.setValue("description", e.currentTarget.value)}
            error={add.errors.description}
          />
          <MultiSelect
            label="权限"
            data={permissions}
            value={add.values.permissions}
            onChange={(value) => add.setValue("permissions", value)}
            error={add.errors.permissions}
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
        opened={edit.values.name !== ""}
        onClose={() => edit.reset()}
        title={`编辑角色: ${edit.values.name}`}
      >
        <Form onSubmit={edit.onSubmit}>
          <TextInput
            label="描述"
            placeholder="描述"
            value={edit.values.description ?? ""}
            onChange={(e) =>
              edit.setValue("description", e.currentTarget.value)
            }
            error={edit.errors.description}
          />
          <MultiSelect
            label="权限"
            data={permissions}
            value={edit.values.permissions}
            onChange={(value) => edit.setValue("permissions", value)}
            error={edit.errors.permissions}
          />
          <Button type="submit" fullWidth loading={edit.loading}>
            提交
          </Button>
        </Form>
      </Modal>
    </AppShellContainer>
  );
};

export default Roles;
