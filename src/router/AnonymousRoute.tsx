import React from "react";
import { RouteProps } from "react-router";
import { Redirect, Route } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import AuthorizeView from "./AuthorizeView";

type Props = RouteProps;

export const AnonymousRoute: React.FC<Props> = (props) => {
  return (
    <Route
      {...props}
      render={(p) => (
        <AuthorizeView loading={<LoadingBox />}>
          {(user) => (user ? <Redirect to="/" /> : props?.render?.(p))}
        </AuthorizeView>
      )}
    />
  );
};
