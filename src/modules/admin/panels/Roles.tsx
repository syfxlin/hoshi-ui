import React, { useMemo, useState } from "react";
import { useTh } from "../../../theme/hooks/use-th";
import useToast from "../../../utils/use-toast";
import useSWR from "swr";
import {
  adminDeleteRole,
  adminListRoles,
  adminUpdateRole,
  UpdateRole,
} from "../../../api/admin";
import BaseTable, { AutoResizer, ColumnShape } from "react-base-table";
import { Role } from "../../../api/ums";
import { Badge, Button, Modal, MultiSelect, TextInput } from "@mantine/core";
import { HStack, VStack } from "../../../components/layout/Stack";
import ColorModeButton from "../../../components/header/ColorModeButton";
import Panel from "../../../components/Panel";
import Box from "../../../components/layout/Box";
import { css } from "@emotion/react";
import useForm from "../../../utils/use-form";
import { Submit } from "../../ums/form";
import { wrap } from "../../../utils/react";
import { permissions } from "../../../api/permissions";
import AppShellContainer from "../../../components/app-shell/AppShellContainer";
import AppShellHeader from "../../../components/app-shell/AppShellHeader";

const Roles: React.FC = () => {
  const th = useTh();
  const toast = useToast();
  // query & data
  const query = useSWR(["adminListRoles"], () => adminListRoles());
  const data = useMemo(() => query.data?.data, [query.data]);
  // edit form
  const edit = useForm<{
    name: string;
    description: string;
    permissions: string[];
  }>({
    initial: {
      name: "",
      description: "",
      permissions: [],
    },
  });
  // roles table
  const columns = useMemo<ColumnShape<Role>[]>(
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
          const [forceDelete, setForceDelete] = useState(false);
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
                  if (!forceDelete) {
                    setForceDelete(true);
                    setTimeout(() => setForceDelete(false), 5000);
                  } else {
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
                  }
                }}
              >
                {forceDelete ? "确认删除？" : "删除"}
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
        opened={edit.values.name !== ""}
        onClose={() => edit.reset()}
        title={`编辑角色: ${edit.values.name}`}
      >
        <form
          onSubmit={edit.onSubmit((values) => {
            const role: UpdateRole = {};
            if (values.description !== "") {
              role.description = values.description;
            }
            role.permissions = values.permissions;
            edit.setLoading(true);
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
              .finally(() => edit.setLoading(false));
          })}
        >
          <VStack>
            <TextInput
              label="描述"
              placeholder="描述"
              value={edit.values.description}
              onChange={(e) =>
                edit.setValue("description", e.currentTarget.value)
              }
              error={edit.errors.description}
            />
            <MultiSelect
              data={permissions}
              value={edit.values.permissions}
              onChange={(value) => edit.setValue("permissions", value)}
              error={edit.errors.permissions}
            />
            <Submit loading={edit.loading}>提交</Submit>
          </VStack>
        </form>
      </Modal>
    </AppShellContainer>
  );
};

export default Roles;
