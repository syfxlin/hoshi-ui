import { addFollowing, UserView } from "../../api/ums";
import React from "react";
import { Anchor, Button, Card, Image, Text, Title } from "@mantine/core";
import AspectRatio from "../../components/layout/AspectRatio";
import { css } from "@emotion/react";
import { LinkProps } from "react-router-dom";
import { Link } from "../../components/Link";
import Flex from "../../components/layout/Flex";
import AuthorizeView from "../../router/AuthorizeView";
import { Handbag, LinkTwo, Local } from "@icon-park/react";
import InfoItem from "./InfoItem";
import { HStack, VStack } from "../../components/layout/Stack";
import Box from "../../components/layout/Box";
import useLoading from "../../utils/use-loading";
import useToast from "../../utils/use-toast";
import { useTh } from "../../theme/hooks/use-th";

type UserCardProps = {
  user: UserView;
};

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const th = useTh();
  const toast = useToast();
  const loading = useLoading();
  return (
    <Card padding="xl" shadow="md" radius="md">
      <VStack spacing="lg">
        <AspectRatio
          ratio={1}
          css={css`
            margin: 0;
            width: 100%;
          `}
        >
          <Image
            withPlaceholder
            src={user.info.avatar ?? undefined}
            alt={user.username}
            width="auto"
            css={css`
              border-radius: 50%;
              margin: ${th.spacing(6)};
              width: auto !important;
              height: auto !important;

              img {
                width: 100% !important;
                height: 100% !important;
              }
            `}
          />
        </AspectRatio>
        <Box>
          <Title
            order={2}
            css={css`
              font-weight: 500;
            `}
          >
            {user.nickname}
          </Title>
          <Title
            order={4}
            css={css`
              font-weight: 400;
              color: ${th.color("gray.6", "gray.5")};
            `}
          >
            {user.username}
          </Title>
        </Box>
        {user.info.bio && <Text>{user.info.bio}</Text>}
        <HStack spacing="xl" justify="center">
          <FollowButton
            name="关注者"
            count={user.followersCount}
            to={{ search: "?tab=followers" }}
          />
          <FollowButton
            name="关注中"
            count={user.followingCount}
            to={{ search: "?tab=following" }}
          />
        </HStack>
        <AuthorizeView>
          {(me, auth, props) => {
            const canFollowing = !me || me.id !== user.id;
            const onClick = () => {
              loading.start();
              addFollowing(user.id)
                .then(
                  toast.api.success({
                    title: `关注成功`,
                  })
                )
                .then(loading.then)
                .catch(
                  toast.api.error({
                    title: `关注失败`,
                  })
                );
            };
            return (
              canFollowing && (
                <Button {...props} fullWidth onClick={onClick}>
                  关注
                </Button>
              )
            );
          }}
        </AuthorizeView>
        <VStack spacing="xs">
          {user.info.address && (
            <InfoItem icon={<Local />}>{user.info.address}</InfoItem>
          )}
          {user.info.url && (
            <InfoItem icon={<LinkTwo />}>
              <Anchor href={user.info.url}>{user.info.url}</Anchor>
            </InfoItem>
          )}
          {user.info.company && (
            <InfoItem icon={<Handbag />}>{user.info.company}</InfoItem>
          )}
        </VStack>
      </VStack>
    </Card>
  );
};

export default UserCard;

const FollowButton: React.FC<{
  name: string;
  count: number;
  to: LinkProps["to"];
}> = ({ name, count, to, ...props }) => {
  const th = useTh();
  return (
    <Link to={to} {...props}>
      <Flex align="center" direction="column">
        <Text
          css={css`
            font-weight: 500;
            font-size: ${th.fontSize("xl")};
          `}
        >
          {count}
        </Text>
        <Text
          css={css`
            font-size: ${th.fontSize("sm")};
          `}
        >
          {name}
        </Text>
      </Flex>
    </Link>
  );
};
