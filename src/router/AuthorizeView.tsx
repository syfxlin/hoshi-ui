import React from "react";
import { useAuth } from "../store/auth";
import { Loadable } from "recoil";
import { User } from "../api/ums";

type AuthorizeViewProps = {
  loading?:
    | React.ReactNode
    | ((
        auth: Loadable<User | null | undefined>,
        props: any
      ) => React.ReactNode);
  children?:
    | React.ReactNode
    | ((
        user: User | null | undefined,
        auth: Loadable<User | null | undefined>,
        props: any
      ) => React.ReactNode);
};

const AuthorizeView: React.FC<AuthorizeViewProps> = ({
  loading,
  children,
  ...props
}) => {
  const [auth] = useAuth();
  if (auth.state === "loading") {
    return (
      <>{typeof loading === "function" ? loading(auth, props) : loading}</>
    );
  } else if (auth.state === "hasValue") {
    const value = auth.getValue();
    return (
      <>
        {typeof children === "function"
          ? children(value, auth, props)
          : children}
      </>
    );
  }
  return (
    <>
      {typeof children === "function" ? children(null, auth, props) : children}
    </>
  );
};

export default AuthorizeView;
