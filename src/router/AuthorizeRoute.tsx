import React from "react";
import { RouteProps } from "react-router";
import { Navigate, Route } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import PermissionsView from "./PermissionsView";
import Block from "./Block";
import { Assign } from "../utils/types";

type AuthorizeRouteProps = Assign<
  RouteProps,
  {
    roles?: string[];
  }
>;

export const AuthorizeRoute: React.FC<AuthorizeRouteProps> = (props) => {
  return (
    <Route
      {...props}
      element={
        <PermissionsView loading={<LoadingBox />} permissions={props.roles}>
          {(status) => {
            if (status === "accept") {
              return props?.element;
            } else if (status === "block") {
              return <Block roles={props.roles} />;
            } else {
              return <Navigate to="/login" />;
            }
          }}
        </PermissionsView>
      }
    />
  );
};
