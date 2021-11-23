import React, { forwardRef } from "react";
import Header from "../../components/header/Header";
import Main from "../../components/Main";
import Center from "../../components/layout/Center";
import { Card, Title } from "@mantine/core";
import { css } from "@emotion/react";
import { useTh } from "../../theme/hooks/use-th";
import Stack, { StackProps } from "../../components/layout/Stack";

type FormPageProps = {
  title: React.ReactNode;
};

const FormPage: React.FC<FormPageProps> = (props) => {
  const th = useTh();
  return (
    <>
      <Header />
      <Main
        css={css`
          background-color: ${th.color("gray.0", "dark.7")};
        `}
      >
        <Center grow={1}>
          <Card
            css={css`
              width: 25rem;
              margin: 0 ${th.spacing(5)};
              padding: ${th.spacing(5)};
              box-shadow: ${th.shadow("md")};
              border-radius: ${th.radius("md")};
            `}
          >
            <Title
              order={2}
              css={css`
                font-weight: 500;
                text-align: center;
              `}
            >
              Hoshi-Note
            </Title>
            <Title
              order={3}
              css={css`
                font-weight: 500;
                text-align: center;
                margin-bottom: ${th.spacing(5)};
              `}
            >
              {props.title}
            </Title>
            {props.children}
          </Card>
        </Center>
      </Main>
    </>
  );
};

export default FormPage;

export const LinkGroup = forwardRef<HTMLDivElement, StackProps>(
  (props, ref) => {
    const th = useTh();
    return (
      <Stack
        {...props}
        justify="center"
        spacing="xs"
        divider={<span>-</span>}
        ref={ref}
        css={css`
          margin-top: ${th.spacing(2)};
        `}
      />
    );
  }
);
