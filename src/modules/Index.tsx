import React from "react";
import Main from "../components/Main";
import { Navigate } from "react-router-dom";
import useMe from "../api/use-me";

const Index: React.FC = () => {
  const me = useMe();
  return <Main>{me.data && <Navigate to="/dashboard" />}</Main>;
};

export default Index;
