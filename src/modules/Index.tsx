import React from "react";
import AuthorizeView from "../router/AuthorizeView";
import Main from "../components/Main";
import { Navigate } from "react-router-dom";

const Index: React.FC = () => {
  return (
    <Main>
      <AuthorizeView>
        {(user) => (user ? <Navigate to="/dashboard" /> : "Index")}
      </AuthorizeView>
    </Main>
  );
};

export default Index;
