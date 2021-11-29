import { UserView } from "../../api/ums";
import React from "react";
import { useTh } from "../../theme/hooks/use-th";
import useShares from "../../api/use-shares";
import { Search } from "@icon-park/react";
import { Loader, Pagination, SegmentedControl, TextInput } from "@mantine/core";
import { HStack, VStack } from "../../components/layout/Stack";
import NoteCard from "../../components/panel/NoteCard";
import { css } from "@emotion/react";
import Async from "../../components/Async";
import { useNavigate } from "react-router-dom";

type OverviewProps = {
  user: UserView;
};

const Overview: React.FC<OverviewProps> = ({ user }) => {
  const th = useTh();
  const navigate = useNavigate();
  const shares = useShares(user.id);
  return (
    <VStack spacing={6}>
      <HStack align="center" justify="space-between">
        <TextInput
          aria-label="搜索笔记"
          placeholder="搜索笔记"
          size="xs"
          icon={<Search />}
          value={shares.search}
          onChange={(e) => shares.setSearch(e.currentTarget.value)}
          rightSection={
            !shares.error && !shares.data ? <Loader size="xs" /> : <div />
          }
        />
        <HStack spacing={2}>
          <SegmentedControl
            value={shares.sort[0]}
            onChange={(value) => shares.setSort([value, shares.sort[1]])}
            size="xs"
            data={[
              { label: "笔记名称", value: "name" },
              { label: "创建时间", value: "createdTime" },
              { label: "最后修改时间", value: "updatedTime" },
            ]}
          />
          <SegmentedControl
            value={shares.sort[1]}
            onChange={(value: "asc" | "desc") =>
              shares.setSort([shares.sort[0], value])
            }
            size="xs"
            data={[
              { label: "顺序", value: "asc" },
              { label: "逆序", value: "desc" },
            ]}
          />
        </HStack>
      </HStack>
      <Async query={shares}>
        <VStack spacing={2}>
          {shares.values.map((item) => {
            return (
              <NoteCard
                note={item}
                key={item.id}
                onClick={() => navigate(`/share/${item.id}`)}
              />
            );
          })}
          {shares.data && (
            <Pagination
              total={shares.data.pages}
              page={shares.page}
              onChange={shares.setPage}
              position="center"
              css={css`
                margin-top: ${th.spacing(2)};
                margin-bottom: ${th.spacing(4)};
              `}
            />
          )}
        </VStack>
      </Async>
    </VStack>
  );
};

export default Overview;
