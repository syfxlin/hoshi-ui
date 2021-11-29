import React from "react";
import { UserView } from "../../api/ums";
import { useLocation, useParams } from "react-router-dom";
import Async from "../../components/Async";
import Main from "../../components/Main";
import { Card, Col, Container, Grid } from "@mantine/core";
import UserCard from "./UserCard";
import FollowList from "./FollowList";
import Header from "../../components/header/Header";
import { css } from "@emotion/react";
import useUser from "../../api/use-user";
import { useTh } from "../../theme/hooks/use-th";
import Overview from "./Overview";

const tabs: Record<string, (user: UserView) => React.ReactNode> = {
  overview: (user) => <Overview user={user} />,
  followers: (user) => <FollowList user={user} type="followers" />,
  following: (user) => <FollowList user={user} type="following" />,
};

const UserInfo: React.FC = () => {
  const th = useTh();

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const tab = params.get("tab") ?? "overview";
  const { username } = useParams<"username">();

  const user = useUser(username as string);
  return (
    <>
      <Header />
      <Main
        css={css`
          padding-top: calc(60px + ${th.spacing(4)});
          padding-bottom: ${th.spacing(20)};
          background-color: ${th.color("gray.0", "dark.7")};
        `}
      >
        <Async query={user} error="获取用户信息错误">
          <Container
            padding="md"
            css={css`
              width: 100%;
            `}
          >
            <Grid gutter="md">
              <Col span={12} md={4}>
                <UserCard user={user.data as UserView} />
              </Col>
              <Col span={12} md={8}>
                <Card padding="xl" shadow="md" radius="md">
                  {(tabs[tab] ?? tabs["overview"])(user.data as UserView)}
                </Card>
              </Col>
            </Grid>
          </Container>
        </Async>
      </Main>
    </>
  );
};

export default UserInfo;
