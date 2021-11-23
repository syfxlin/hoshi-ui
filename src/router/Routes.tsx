import React from "react";
import { AnonymousRoute } from "./AnonymousRoute";
import { AuthorizeRoute } from "./AuthorizeRoute";
import { Route, RouteObject, useRoutes } from "react-router-dom";

export function createRoutesFromChildren(
  children: React.ReactNode
): RouteObject[] {
  const routes: RouteObject[] = [];

  React.Children.forEach(children, (element) => {
    if (!React.isValidElement(element)) {
      return;
    }

    if (element.type === React.Fragment) {
      // eslint-disable-next-line prefer-spread
      routes.push.apply(
        routes,
        createRoutesFromChildren(element.props.children)
      );
      return;
    }

    if (
      element.type !== Route &&
      element.type !== AnonymousRoute &&
      element.type !== AuthorizeRoute
    ) {
      throw new Error(
        `[${
          typeof element.type === "string" ? element.type : element.type.name
        }] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
      );
    }

    const route: RouteObject = {
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      index: element.props.index,
      path: element.props.path,
    };

    if (element.props.children) {
      route.children = createRoutesFromChildren(element.props.children);
    }

    routes.push(route);
  });

  return routes;
}

export interface RoutesProps {
  location?: Partial<Location> | string;
}

const Routes: React.FC<RoutesProps> = (props) => {
  return useRoutes(createRoutesFromChildren(props.children), props.location);
};

export default Routes;
