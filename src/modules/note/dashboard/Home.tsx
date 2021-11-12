import React from "react";
import Stack from "../../../components/layout/Stack";
import { css } from "@emotion/react";

const Home: React.FC = () => {
  return (
    <Stack wrapChildren={false}>
      <div
        css={css`
          border: 1px solid blue;
        `}
      >
        Home
      </div>
      <div
        css={css`
          border: 1px solid blue;
        `}
      >
        Home
      </div>
      <div
        css={css`
          border: 1px solid blue;
        `}
      >
        Home
      </div>
    </Stack>
  );
};

export default Home;
