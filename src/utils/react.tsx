import React from "react";

export const wrap =
  <P extends Record<string, any>>(render: React.FC<P>) =>
  (props: P) => {
    const Render = render;
    return <Render {...props} />;
  };
