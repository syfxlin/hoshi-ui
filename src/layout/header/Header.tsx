import React from "react";
import { css } from "@emotion/react";
import icon from "../../assets/icon.png";
import AuthButton from "./AuthButton";
import { Link } from "../../components/Link";
import ColorModeButton from "./ColorModeButton";
import { HStack } from "../../components/layout/Stack";
import { useTh } from "../../theme/hooks/use-th";
import { Image } from "@mantine/core";
import Box from "../../components/layout/Box";

const Header: React.FC = ({ children }) => {
  const th = useTh();
  return (
    <Box
      as="header"
      css={css`
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: ${th.spacing(4)};
        padding-right: ${th.spacing(4)};
      `}
    >
      <Box
        as="section"
        css={css`
          display: flex;
          align-items: center;
          justify-content: center;
        `}
      >
        <Image src={icon} alt="Hoshi-Note icon" height={40} width={40} />
        <Link
          to="/"
          css={css`
            font-weight: 500;
            font-size: ${th.fontSize("lg")};
            margin-left: ${th.spacing(6)};
          `}
        >
          Hoshi-Note
        </Link>
      </Box>
      <HStack
        spacing="xs"
        css={css`
          flex: 1;
          margin-left: ${th.spacing(6)};
          display: flex;
          align-items: center;
          justify-content: flex-end;
        `}
      >
        {children}
        <AuthButton />
        <ColorModeButton />
      </HStack>
    </Box>
  );
};

export default Header;
