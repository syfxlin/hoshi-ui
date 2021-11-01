import React, { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import { Anchor, AnchorProps, Button, ButtonProps } from "@mantine/core";

export type LinkProps = AnchorProps<NavLink>;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  return <Anchor {...props} component={NavLink} ref={ref} />;
});

export type BLinkProps = ButtonProps<NavLink>;

export const BLink = forwardRef<HTMLAnchorElement, BLinkProps>((props, ref) => {
  return <Button {...props} component={NavLink} ref={ref} />;
});
