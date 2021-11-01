import React from "react";
import AuthorizeView from "../router/AuthorizeView";
import Main from "../layout/Main";
import { Redirect } from "react-router-dom";

const Index: React.FC = () => {
  return (
    <Main>
      <AuthorizeView>
        {(user) => (user ? <Redirect to="/dashboard/" /> : "Index")}
      </AuthorizeView>
    </Main>
  );
};

export default Index;
