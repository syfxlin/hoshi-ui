import React from "react";
import { Title, TitleProps } from "@mantine/core";
import { css } from "@emotion/react";
import { useTh } from "../../theme/hooks/use-th";

const SubTitle: React.FC<TitleProps> = ({ children, ...props }) => {
  const th = useTh();
  return (
    <Title
      order={3}
      {...props}
      css={css`
        font-size: ${th.spacing("md")};
        padding-bottom: ${th.spacing(1)};
        border-bottom: 1px solid ${th.color("gray.4", "dark.3")};
      `}
    >
      <span
        css={css`
          border-bottom: 3px solid ${th.color("primary.7", "primary.3")};
          padding-bottom: ${th.spacing(1)};
        `}
      >
        {children}
      </span>
    </Title>
  );
};

export default SubTitle;
