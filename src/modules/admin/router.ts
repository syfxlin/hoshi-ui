import { RouteDefinition } from "../../router";
import { match } from "react-router";
import loadable from "@loadable/component";

export const panels: (match: match) => RouteDefinition[] = ({ path }) => [
  {
    path: `${path}/home`,
    component: loadable(() => import("./panels/Home")),
  },
  {
    path: `${path}/users`,
    component: loadable(() => import("./panels/Users")),
    authorize: "USER_MANAGER",
  },
  {
    path: `${path}/roles`,
    component: loadable(() => import("./panels/Roles")),
    authorize: "ROLE_MANAGER",
  },
];
