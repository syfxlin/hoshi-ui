import React from "react";
import { RouteProps } from "react-router";
import { Redirect, Route } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import AuthorizeView from "./AuthorizeView";

type AnonymousRouteProps = RouteProps;

export const AnonymousRoute: React.FC<AnonymousRouteProps> = (props) => {
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
