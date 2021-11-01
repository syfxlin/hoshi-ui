import React from "react";
import { RouteDefinition } from "./index";
import { Switch } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import { AnonymousRoute } from "./AnonymousRoute";
import { RouteProps } from "react-router";
import { Location } from "history";
import { AuthorizeRoute } from "./AuthorizeRoute";

type Props = {
  routes: RouteDefinition[];
  sw?: boolean | undefined;
};

const ArrayRoute: React.FC<Props> = ({ routes, sw }) => {
  const Root = sw ? Switch : React.Fragment;
  return (
    <Root>
      {routes.map((route, index) => {
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
          const roles = typeof authorize === "string" ? [authorize] : authorize;
          return (
            <AuthorizeRoute {...props} roles={roles} key={`route-${index}`} />
          );
        }
      })}
    </Root>
  );
};

export default ArrayRoute;
