import { UserView } from "../../api/ums";
import React from "react";
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
import Async from "../../components/Async";
import InfoItem from "./InfoItem";
import AuthorizeView from "../../router/AuthorizeView";
import { HStack, VStack } from "../../components/layout/Stack";
import useLoading from "../../utils/use-loading";
import { css } from "@emotion/react";
import { useTh } from "../../theme/hooks/use-th";
import useFollow from "../../api/use-follow";

type FollowListProps = {
  user: UserView;
  type: "followers" | "following";
};

const FollowList: React.FC<FollowListProps> = ({ user, type }) => {
  const th = useTh();
  const follow = useFollow(user.id, type);
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
        {follow.data && (
          <Text size="sm">
            {type === "followers" ? "关注他的 " : "他的关注 "}
            {follow.data.total}
          </Text>
        )}
      </Flex>
      <Divider my="xs" />
      <Async query={follow}>
        <VStack
          spacing="sm"
          divider={<Divider />}
          css={css`
            margin-top: ${th.spacing(3)};
            margin-bottom: ${th.spacing(4)};
          `}
        >
          {follow.values.map((user) => (
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
                  <Link to={`/users/${user.username}`} color="dimmed" size="sm">
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
                      (isFollowing ? follow.$deleteFollow : follow.$addFollow)(
                        user.id
                      ).then(loading.then);
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
        {follow.data && (
          <Pagination
            total={follow.data.pages}
            page={follow.page}
            onChange={follow.setPage}
            position="center"
          />
        )}
      </Async>
    </>
  );
};

export default FollowList;
