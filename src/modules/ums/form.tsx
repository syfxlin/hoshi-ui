import React, { forwardRef } from "react";
import {
  Button,
  ButtonProps,
  Card as MCard,
  CardProps,
  TextProps,
  Title as MTitle,
} from "@mantine/core";
import { css } from "@emotion/react";
import Stack, { StackProps } from "../../components/layout/Stack";
import { useTh } from "../../theme/hooks/use-th";

export const Card: React.FC<CardProps<"div">> = ({ children, ...props }) => {
  return (
    <MCard
      {...props}
      shadow="md"
      radius="md"
      padding="xl"
      css={css`
        width: 25rem;
        margin: 0 20px;
      `}
    >
      {children}
    </MCard>
  );
};

export const Title: React.FC<TextProps<"div">> = (props) => {
  const th = useTh();
  return (
    <MTitle
      order={2}
      {...props}
      css={css`
        font-weight: 500;
        margin-bottom: ${th.spacing(5)};
        text-align: center;
      `}
    />
  );
};

export const Submit: React.FC<ButtonProps<"button">> = (props) => {
  return <Button {...props} type="submit" fullWidth />;
};

export const LinkGroup = forwardRef<HTMLDivElement, StackProps>(
  (props, ref) => {
    const th = useTh();
    return (
      <Stack
        {...props}
        justify="center"
        spacing="xs"
        divider="-"
        ref={ref}
        css={css`
          margin-top: ${th.spacing(2)};
        `}
      />
    );
  }
);
