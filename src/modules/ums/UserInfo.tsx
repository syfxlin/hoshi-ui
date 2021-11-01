import React from "react";
import { User, userByUsername } from "../../api/ums";
import { useLocation, useParams } from "react-router-dom";
import Async from "../../components/Async";
import Main from "../../components/Main";
import { Card, Col, Container, Grid } from "@mantine/core";
import UserCard from "./UserCard";
import FollowList from "./FollowList";
import useSWR from "swr";
import Header from "../../components/header/Header";
import { css } from "@emotion/react";

type Params = {
  username: string;
};

const tabs: Record<string, (user: User) => React.ReactNode> = {
  overview: () => "Text",
  followers: (user) => <FollowList user={user} type="followers" />,
  following: (user) => <FollowList user={user} type="following" />,
};

const UserInfo: React.FC = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const tab = params.get("tab") ?? "overview";
  const { username } = useParams<Params>();
  const query = useSWR(["userByUsername", username], (key, username) =>
    userByUsername(username)
  );
  return (
    <>
      <Header />
      <Main
        css={css`
          margin-top: 60px;
        `}
      >
        <Async query={query} error="获取用户信息错误">
          {(data) => (
            <Container
              padding="md"
              css={css`
                width: 100%;
              `}
            >
              <Grid gutter="md">
                <Col span={12} md={4}>
                  <UserCard user={data.data as User} />
                </Col>
                <Col span={12} md={8}>
                  <Card padding="xl" shadow="md" radius="md">
                    {(tabs[tab] ?? tabs["overview"])(data.data as User)}
                  </Card>
                </Col>
              </Grid>
            </Container>
          )}
        </Async>
      </Main>
    </>
  );
};

export default UserInfo;
