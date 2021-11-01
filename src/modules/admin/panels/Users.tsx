import React, { useMemo, useState } from "react";
import { Badge, Button, Container, Pagination, Title } from "@mantine/core";
import { css } from "@emotion/react";
import NHeader from "../../../layout/header/NHeader";
import ColorModeButton from "../../../layout/header/ColorModeButton";
import { HStack } from "../../../components/layout/Stack";
import Box from "../../../components/layout/Box";
import { useTh } from "../../../theme/hooks/use-th";
import useSWR from "swr";
import { adminListUsers } from "../../../api/admin";
import { User } from "../../../api/ums";
import Async from "../../../components/Async";
import BaseTable, {
  AutoResizer,
  ColumnShape,
  SortOrder,
} from "react-base-table";
import "react-base-table/styles.css";

const Users: React.FC = () => {
  const th = useTh();
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
        width: 0,
        flexGrow: 1,
        resizable: true,
        sortable: true,
      },
      {
        key: "username",
        title: "用户名",
        dataKey: "username",
        width: 0,
        flexGrow: 1,
        resizable: true,
        sortable: true,
      },
      {
        key: "nickname",
        title: "昵称",
        dataKey: "nickname",
        width: 0,
        flexGrow: 1,
        resizable: true,
        sortable: true,
      },
      {
        key: "email",
        title: "邮箱",
        dataKey: "email",
        width: 0,
        flexGrow: 1,
        resizable: true,
        sortable: true,
      },
      {
        key: "status",
        title: "状态",
        dataKey: "status",
        width: 0,
        flexGrow: 1,
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
        width: 0,
        flexGrow: 1,
        resizable: true,
        sortable: true,
      },
      {
        key: "operate",
        title: "操作",
        width: 0,
        flexGrow: 1,
        cellRenderer: (p) => (
          <HStack spacing={1}>
            <Button variant="link" onClick={() => alert(p.rowData.id)}>
              Test
            </Button>
          </HStack>
        ),
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
        size="md"
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
      </Container>
    </Box>
  );
};

export default Users;
