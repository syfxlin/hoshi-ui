import React, { useMemo } from "react";
import { useTh } from "../../../theme/hooks/use-th";
import { AddRoleView, UpdateRoleView } from "../../../api/admin";
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
import Panel from "../../../components/panel/Panel";
import Box from "../../../components/layout/Box";
import { css } from "@emotion/react";
import useForm from "../../../utils/use-form";
import { wrap } from "../../../utils/react";
import { permissions } from "../../../api/permissions";
import AppShellContainer from "../../../components/app-shell/AppShellContainer";
import AppShellHeader from "../../../components/app-shell/AppShellHeader";
import Form from "../../../components/form/Form";
import { useModals } from "@mantine/modals";
import useRoles from "../../../api/use-roles";

const Roles: React.FC = () => {
  const th = useTh();
  // roles & data
  const roles = useRoles();
  // form
  const add = useForm<AddRoleView>({
    initial: {
      name: "",
      description: "",
      status: true,
      permissions: [],
    },
    validate: {
      name: (value) => value.length > 0 || "角色名称必须不为空",
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleSubmit: (values, loading) => {
      loading(
        roles
          .$addRole({
            name: values.name,
            description: values.description,
            status: values.status,
            permissions: values.permissions,
          })
          .then(() => add.close())
      );
    },
  });
  const edit = useForm<UpdateRoleView>({
    initial: {
      name: "",
      description: "",
      permissions: [],
    },
    handleSubmit: (values, loading) => {
      loading(
        roles
          .$updateRole({
            name: values.name,
            description: values.description || undefined,
            permissions: values.permissions,
          })
          .then(() => edit.close())
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
                  roles.$updateRole({
                    name: rowData.name,
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
                      roles.$deleteRole(rowData.name);
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
    [roles, edit]
  );
  return (
    <AppShellContainer>
      <AppShellHeader>
        <div />
        <HStack spacing="xs" align="center">
          <Button size="xs" onClick={() => add.open()}>
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
                data={roles.values()}
                rowKey="name"
              />
            )}
          </AutoResizer>
        </Box>
      </Panel>
      <Modal opened={add.opened} onClose={() => add.close()} title="新增角色">
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
        opened={edit.opened}
        onClose={() => edit.close()}
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
