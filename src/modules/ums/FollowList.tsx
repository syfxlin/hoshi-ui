import {
  addFollowing,
  deleteFollowing,
  followByUserId,
  User,
} from "../../api/ums";
import React, { useMemo, useState } from "react";
import Flex from "../../components/layout/Flex";
import { BLink, Link } from "../../components/Link";
import { Handbag, Left, LinkTwo, Local } from "@icon-park/react";
import {
  Anchor,
  Avatar,
  Button,
  Divider,
  Pagination,
  Text,
} from "@mantine/core";
import useSWR from "swr";
import Async from "../../components/Async";
import InfoItem from "./InfoItem";
import AuthorizeView from "../../router/AuthorizeView";
import { HStack, VStack } from "../../components/layout/Stack";
import useToast from "../../utils/use-toast";
import useLoading from "../../utils/use-loading";
import { css } from "@emotion/react";
import { useTh } from "../../theme/hooks/use-th";

type FollowListProps = {
  user: User;
  type: "followers" | "following";
};

const FollowList: React.FC<FollowListProps> = ({ user, type }) => {
  const th = useTh();
  const toast = useToast();
  const [page, setPage] = useState(1);
  const query = useSWR(
    ["followByUserId", type, user.id, page],
    (key, type, userId, page) => followByUserId(type, userId, page)
  );
  const data = useMemo(() => query.data?.data, [query.data]);
  return (
    <>
      <Flex align="center">
        <BLink
          to={{ search: "" }}
          variant="light"
          size="xs"
          leftIcon={<Left />}
        >
          返回
        </BLink>
        <Divider orientation="vertical" mx="xs" />
        {data && (
          <Text size="sm">
            {type === "followers" ? "关注他的 " : "他的关注 "}
            {data.total}
          </Text>
        )}
      </Flex>
      <Divider my="xs" />
      <Async query={query}>
        <VStack
          spacing="sm"
          divider={<Divider />}
          css={css`
            margin-top: ${th.spacing(3)};
            margin-bottom: ${th.spacing(4)};
          `}
        >
          {data &&
            data.records.map((user) => (
              <Flex
                key={user.id}
                css={css`
                  width: 100%;
                `}
              >
                <Avatar
                  size="lg"
                  radius="xl"
                  src={user.info.avatar ?? undefined}
                  alt={`${user.nickname}'s avatar`}
                  mr="md"
                />
                <VStack
                  spacing="xs"
                  grow={1}
                  css={css`
                    margin-right: ${th.spacing(4)};
                  `}
                >
                  <HStack spacing="xs">
                    <Link to={`/users/${user.username}`} color="dark">
                      {user.nickname}
                    </Link>
                    <Link
                      to={`/users/${user.username}`}
                      color="dimmed"
                      size="sm"
                    >
                      {user.username}
                    </Link>
                  </HStack>
                  <Text size="xs">{user.info.bio ?? "未填写"}</Text>
                  <HStack spacing="md">
                    <InfoItem icon={<Local />} size="xs">
                      {user.info.address ?? "未填写"}
                    </InfoItem>
                    <InfoItem icon={<LinkTwo />} size="xs">
                      <Anchor href={user.info.url ?? undefined} size="xs">
                        {user.info.url ?? "未填写"}
                      </Anchor>
                    </InfoItem>
                    <InfoItem icon={<Handbag />} size="xs">
                      {user.info.company ?? "未填写"}
                    </InfoItem>
                  </HStack>
                </VStack>
                <Flex align="center">
                  <AuthorizeView>
                    {(me) => {
                      const isFollowing = me && type === "following";
                      const operate = isFollowing ? "取消关注" : "关注";
                      const loading = useLoading();
                      const onClick = () => {
                        loading.start();
                        (isFollowing ? deleteFollowing : addFollowing)(user.id)
                          .then(
                            toast.api.success({
                              title: `${operate}成功`,
                            })
                          )
                          .then(loading.then)
                          .then(() => query.mutate())
                          .catch(
                            toast.api.error({
                              title: `${operate}失败`,
                            })
                          );
                      };
                      return (
                        <Button
                          size="xs"
                          variant="light"
                          loading={loading.loading}
                          onClick={onClick}
                        >
                          {operate}
                        </Button>
                      );
                    }}
                  </AuthorizeView>
                </Flex>
              </Flex>
            ))}
        </VStack>
        {data && (
          <Pagination
            total={data.pages}
            page={page}
            onChange={setPage}
            position="center"
          />
        )}
      </Async>
    </>
  );
};

export default FollowList;
