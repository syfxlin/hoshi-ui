import React from "react";
import { RouteProps } from "react-router";
import { Redirect, Route } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import RoleView from "./RoleView";
import Block from "./Block";

type AuthorizeRouteProps = RouteProps & {
  roles?: string[];
};

export const AuthorizeRoute: React.FC<AuthorizeRouteProps> = (props) => {
  return (
    <Route
      {...props}
      render={(p) => (
        <RoleView loading={<LoadingBox />} roles={props.roles}>
          {(status) => {
            if (status === "accept") {
              return props?.render?.(p);
            } else if (status === "block") {
              return <Block roles={props.roles} />;
            } else {
              return <Redirect to="/login" />;
            }
          }}
        </RoleView>
      )}
    />
  );
};
