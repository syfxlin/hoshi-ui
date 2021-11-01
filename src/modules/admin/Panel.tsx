import React from "react";
import { Container, Title } from "@mantine/core";
import { css } from "@emotion/react";
import { useTh } from "../../theme/hooks/use-th";

type PanelProps = {
  title: React.ReactNode;
};

const Panel: React.FC<PanelProps> = ({ title, children }) => {
  const th = useTh();
  return (
    <Container
      size="lg"
      css={css`
        width: 100%;
        margin-top: ${th.spacing(10)};
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      `}
    >
      <Title
        order={1}
        css={css`
          font-weight: 500;
        `}
      >
        {title}
      </Title>
      {children}
    </Container>
  );
};

export default Panel;
