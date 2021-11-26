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

const tabs: Record<string, (user: UserView) => React.ReactNode> = {
  overview: () => "Text",
  followers: (user) => <FollowList user={user} type="followers" />,
  following: (user) => <FollowList user={user} type="following" />,
};

const UserInfo: React.FC = () => {
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
          margin-top: 60px;
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
