import { RouteDefinition } from "../../router";
import { match } from "react-router";
import loadable from "@loadable/component";

export const dashboard: (match: match) => RouteDefinition[] = ({ path }) => [
  {
    path: `${path}/home`,
    component: loadable(() => import("./dashboard/Home")),
  },
  {
    path: `${path}/files`,
    component: loadable(() => import("./dashboard/File")),
  },
];

export const settings: (match: match) => RouteDefinition[] = ({ path }) => [
  {
    path,
    exact: true,
    component: loadable(() => import("./settings/Info")),
  },
  {
    path: `${path}/safety`,
    component: loadable(() => import("./settings/Safety")),
  },
  {
    path: `${path}/tokens`,
    component: loadable(() => import("./settings/Tokens")),
  },
];
