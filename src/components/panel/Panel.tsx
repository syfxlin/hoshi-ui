import React, { forwardRef } from "react";
import { Container, Title } from "@mantine/core";
import { css } from "@emotion/react";
import { useTh } from "../../theme/hooks/use-th";
import { Styles, UIComponent } from "../../utils/types";

type PanelProps = {
  title: React.ReactNode;
  styles?: Styles<"title">;
};

const Panel: UIComponent<"div", PanelProps> = forwardRef(
  ({ title, styles, children }, ref) => {
    const th = useTh();
    return (
      <Container
        size="lg"
        ref={ref}
        css={css`
          width: 100%;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          margin-top: ${th.spacing(10)};
          margin-bottom: ${th.spacing(10)};
        `}
      >
        <Title
          order={1}
          css={css`
            font-weight: 500;
            margin-bottom: ${th.spacing(2)};
            ${styles?.title}
          `}
        >
          {title}
        </Title>
        {children}
      </Container>
    );
  }
);

export default Panel;
