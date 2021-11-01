import React, { useMemo } from "react";
import { getCache } from "@mantine/core";
import { MantineProvider as MantineThemeProvider } from "@mantine/styles";
import { CacheProvider, Theme, useTheme } from "@emotion/react";
import EmotionSystemProvider from "./EmotionSystemProvider";
import { theme } from "./index";
import { convert } from "./hooks/convert";

export type MantineProviderProps = {
  theme: Omit<Theme, "colorScheme">;
};

const MantineThemeConverter: React.FC = ({ children }) => {
  const theme = useTheme();
  const mantineTheme = useMemo(() => convert(theme), [theme]);
  return (
    <MantineThemeProvider theme={mantineTheme}>{children}</MantineThemeProvider>
  );
};

const MantineProvider: React.FC<MantineProviderProps> = (props) => {
  return (
    <CacheProvider value={getCache()}>
      <EmotionSystemProvider theme={theme}>
        <MantineThemeConverter>{props.children}</MantineThemeConverter>
      </EmotionSystemProvider>
    </CacheProvider>
  );
};

export default MantineProvider;
