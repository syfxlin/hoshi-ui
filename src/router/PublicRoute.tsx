import React from "react";
import { Route } from "react-router-dom";
import { RouteProps } from "react-router";

type Props = RouteProps;

const PublicRoute: React.FC<Props> = (props) => {
  return <Route {...props} />;
};

export default PublicRoute;
