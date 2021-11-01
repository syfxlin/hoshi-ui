import React from "react";
import { Route } from "react-router-dom";
import { RouteProps } from "react-router";

type PublicRouteProps = RouteProps;

const PublicRoute: React.FC<PublicRouteProps> = (props) => {
  return <Route {...props} />;
};

export default PublicRoute;
