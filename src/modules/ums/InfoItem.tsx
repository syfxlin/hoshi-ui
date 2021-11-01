import React from "react";
import { MantineSize, Text } from "@mantine/core";
import Flex, { FlexProps } from "../../components/layout/Flex";
import { css } from "@emotion/react";

const InfoItem: React.FC<
  { icon: React.ReactNode; size?: MantineSize } & FlexProps
> = ({ children, icon, size, ...props }) => {
  return (
    <Flex align="center" {...props}>
      <Text
        size={size}
        css={css`
          width: 1em;
          height: 1em;

          span {
            margin-top: 1px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}
      >
        {icon}
      </Text>
      <Text size={size} ml="xs">
        {children}
      </Text>
    </Flex>
  );
};

export default InfoItem;
