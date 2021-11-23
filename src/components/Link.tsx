import React, { forwardRef } from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import { Anchor, AnchorProps, Button, ButtonProps } from "@mantine/core";

export type LinkProps = Omit<AnchorProps<typeof NavLink>, "className"> & {
  className?: NavLinkProps["className"];
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  // @ts-ignore
  return <Anchor {...props} component={NavLink} ref={ref} />;
});

export type BLinkProps = Omit<ButtonProps<typeof NavLink>, "className"> & {
  className?: NavLinkProps["className"];
};

export const BLink = forwardRef<HTMLAnchorElement, BLinkProps>((props, ref) => {
  // @ts-ignore
  return <Button {...props} component={NavLink} ref={ref} />;
});
