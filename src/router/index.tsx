import * as React from "react";
import { ExtractRouteParams, RouteComponentProps } from "react-router";
import { Location } from "history";
import Index from "../modules/Index";
import { Redirect } from "react-router-dom";
import loadable from "@loadable/component";

export type RouteDefinition = {
  path: string | string[] | Location;
  component?:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>
    | undefined;
  render?: (
    props: RouteComponentProps<ExtractRouteParams<string, string>>
  ) => React.ReactNode | undefined;
  exact?: boolean | undefined;
  strict?: boolean | undefined;
  sensitive?: boolean | undefined;
  authorize?: "public" | "anonymous" | string | string[] | undefined;
};

export const root: RouteDefinition[] = [
  {
    path: "/",
    exact: true,
    component: Index,
  },
  {
    path: "/login",
    component: loadable(() => import("../modules/ums/Login")),
    authorize: "anonymous",
  },
  {
    path: "/register",
    component: loadable(() => import("../modules/ums/Register")),
    authorize: "anonymous",
  },
  {
    path: "/reset-password",
    component: loadable(() => import("../modules/ums/ResetPassword")),
  },
  {
    path: "/users/:username",
    component: loadable(() => import("../modules/ums/UserInfo")),
  },
  {
    path: "/dashboard",
    exact: true,
    render: () => <Redirect to="/dashboard/home" />,
  },
  {
    path: "/dashboard",
    component: loadable(() => import("../modules/note/Dashboard")),
    authorize: ["ROLE_USER"],
  },
  {
    path: "/admin",
    exact: true,
    render: () => <Redirect to="/admin/home" />,
  },
  {
    path: "/admin",
    component: loadable(() => import("../modules/admin/Admin")),
    authorize: ["USER_MANAGER", "ROLE_MANAGER"],
  },
  {
    path: "/settings",
    component: loadable(() => import("../modules/note/Settings")),
    authorize: ["ROLE_USER"],
  },
];
