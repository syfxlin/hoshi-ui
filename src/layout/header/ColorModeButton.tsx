import React from "react";
import { ActionIcon } from "@mantine/core";
import { DarkMode } from "@icon-park/react";
import { useTh } from "../../theme/hooks/use-th";
import { css } from "@emotion/react";
import { useColorScheme } from "../../theme/EmotionSystemProvider";

const ColorModeButton: React.FC = (props) => {
  const [, toggleColorScheme] = useColorScheme();
  const th = useTh();
  return (
    <ActionIcon
      {...props}
      title="切换夜间模式"
      variant="light"
      color={th.primaryColor}
      onClick={() => toggleColorScheme()}
      css={css`
        height: 30px;
      `}
    >
      <DarkMode />
    </ActionIcon>
  );
};

export default ColorModeButton;
