import React from "react";
import { UserView } from "../api/ums";
import useMe from "../api/use-me";

type AuthorizeViewProps = {
  loading?:
    | React.ReactNode
    | ((auth: ReturnType<typeof useMe>, props: any) => React.ReactNode);
  children?:
    | React.ReactNode
    | ((
        user: UserView | undefined,
        auth: ReturnType<typeof useMe>,
        props: any
      ) => React.ReactNode);
};

const AuthorizeView: React.FC<AuthorizeViewProps> = ({
  loading,
  children,
  ...props
}) => {
  const me = useMe();
  if (!me.error && !me.data) {
    return <>{typeof loading === "function" ? loading(me, props) : loading}</>;
  }
  return (
    <>
      {typeof children === "function" ? children(me.data, me, props) : children}
    </>
  );
};

export default AuthorizeView;
