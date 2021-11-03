import { RouteDefinition } from "../../router";
import { match } from "react-router";
import loadable from "@loadable/component";

export const panels: (match: match) => RouteDefinition[] = ({ path }) => [
  {
    path: `${path}/home`,
    component: loadable(() => import("./panels/Home")),
  },
];
