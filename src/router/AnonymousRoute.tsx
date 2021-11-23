import React from "react";
import { RouteProps } from "react-router";
import { Navigate, Route } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import AuthorizeView from "./AuthorizeView";

type AnonymousRouteProps = RouteProps;

export const AnonymousRoute: React.FC<AnonymousRouteProps> = (props) => {
  return (
    <Route
      {...props}
      element={
        <AuthorizeView loading={<LoadingBox />}>
          {(user) => (user ? <Navigate to="/" /> : props?.element)}
        </AuthorizeView>
      }
    />
  );
};
