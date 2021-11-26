import React from "react";
import useMe from "../../../api/use-me";

const Home: React.FC = () => {
  const me = useMe();
  return (
    <div>
      <button
        onClick={() => {
          me.set(
            (prev) =>
              prev && {
                ...prev,
                username: "Admin1",
              }
          );
        }}
      >
        click
      </button>
    </div>
  );
};

export default Home;
