import React from "react";
import { RouteDefinition } from "./index";
import { Switch, useRouteMatch } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import { AnonymousRoute } from "./AnonymousRoute";
import { match, RouteProps } from "react-router";
import { Location } from "history";
import { AuthorizeRoute } from "./AuthorizeRoute";

type ArrayRouteProps = {
  routes: RouteDefinition[] | ((match: match) => RouteDefinition[]);
  sw?: boolean;
};

const ArrayRoute: React.FC<ArrayRouteProps> = ({ routes, sw = true }) => {
  const match = useRouteMatch();
  const Root = sw ? Switch : React.Fragment;
  return (
    <Root>
      {(typeof routes === "function" ? routes(match) : routes).map(
        (route, index) => {
          const isLocation =
            typeof route.path !== "string" && !(route.path instanceof Array);
          const props: RouteProps = {
            location: isLocation ? (route.path as Location) : undefined,
            path: !isLocation ? (route.path as string | string[]) : undefined,
            render:
              route.render ||
              ((p) => route.component && <route.component {...p} />),
            exact: route.exact,
            sensitive: route.sensitive,
            strict: route.strict,
          };
          const authorize = route.authorize;
          if (!authorize || authorize === "public") {
            return <PublicRoute {...props} key={`route-${index}`} />;
          } else if (authorize === "anonymous") {
            return <AnonymousRoute {...props} key={`route-${index}`} />;
          } else {
            const roles =
              typeof authorize === "string" ? [authorize] : authorize;
            return (
              <AuthorizeRoute {...props} roles={roles} key={`route-${index}`} />
            );
          }
        }
      )}
    </Root>
  );
};

export default ArrayRoute;
