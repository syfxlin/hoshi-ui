import React from "react";
import { Navigate, Route, RouteProps } from "react-router-dom";
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
