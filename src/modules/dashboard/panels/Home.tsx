import React from "react";
import { swr } from "../../../utils/swr-outside";

const Home: React.FC = () => {
  return <div>{JSON.stringify(swr.mutate !== undefined)}</div>;
};

export default Home;
