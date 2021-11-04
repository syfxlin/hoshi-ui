import React, { useCallback } from "react";
import { Loadable } from "recoil";
import AuthorizeView from "./AuthorizeView";
import { Role, User } from "../api/ums";

type RoleViewProps = {
  loading?:
    | React.ReactNode
    | ((
        auth: Loadable<User | null | undefined>,
        props: any
      ) => React.ReactNode);
  children?:
    | React.ReactNode
    | ((
        /**
         * accept 允许访问
         * block 权限不足
         * none 未登录
         */
        status: "accept" | "block" | "none",
        user: User | null | undefined,
        auth: Loadable<User | null | undefined>,
        props: any
      ) => React.ReactNode);
  /**
   * 权限
   * 不加头标记（USER）：只要匹配就标记为允许
   * 加 + 标记（+USER）：只要有一个不匹配则标记为阻止
   * 加 - 标记（-USER）：只要有一个匹配则标记为阻止
   * 阻止优先于允许，只要有一个阻止则全部阻止
   */
  permissions?: string[];
};

const PermissionsView: React.FC<RoleViewProps> = ({
  loading,
  children,
  permissions,
  ...props
}) => {
  const matcher = useCallback(
    (roles: Role[]) => {
      if (!permissions || permissions.length === 0) {
        return true;
      }
      const set = new Set(
        roles
          .filter((role) => role.status)
          .reduce(
            (arr, role) => [...arr, `ROLE_${role.name}`, ...role.permissions],
            [] as string[]
          )
      );
      return !!permissions.reduce((a: null | boolean, role) => {
        if (a === false) {
          return false;
        }
        if (role.startsWith("+")) {
          return set.has(role.substring(1));
        }
        if (role.startsWith("-")) {
          return !set.has(role.substring(1));
        }
        if (set.has(role)) {
          return true;
        }
        return a;
      }, null);
    },
    [permissions]
  );
  return (
    <AuthorizeView loading={loading}>
      {(user, auth) => {
        if (typeof children !== "function") {
          return user && matcher(user.roles) && children;
        } else {
          if (user) {
            return matcher(user.roles)
              ? children("accept", user, auth, props)
              : children("block", user, auth, props);
          } else {
            return children("none", user, auth, props);
          }
        }
      }}
    </AuthorizeView>
  );
};

export default PermissionsView;