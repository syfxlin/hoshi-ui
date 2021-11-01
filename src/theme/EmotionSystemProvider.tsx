import React, { createContext, useContext, useState } from "react";
import { ColorScheme, ThemeTokens } from "./types";
import { ThemeProvider } from "@emotion/react";

export type ColorSchemeContextProps = [ColorScheme, (cs?: ColorScheme) => void];

// @ts-ignore
export const ColorSchemeContext = createContext<ColorSchemeContextProps>(null);

export const useColorScheme = () => {
  const ctx = useContext(ColorSchemeContext);
  if (!ctx) {
    throw new Error(
      "useColorScheme hook was called outside of context, make sure your app is wrapped with ColorSchemeProvider(EmotionSystemProvider) component"
    );
  }
  return ctx;
};

export type EmotionSystemProviderProps = {
  theme: ThemeTokens;
};

const EmotionSystemProvider: React.FC<EmotionSystemProviderProps> = ({
  theme,
  children,
}) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  return (
    <ColorSchemeContext.Provider
      value={[
        colorScheme,
        (cs) =>
          setColorScheme(cs ?? (colorScheme === "dark" ? "light" : "dark")),
      ]}
    >
      <ThemeProvider
        theme={{
          ...theme,
          colorScheme,
        }}
      >
        {children}
      </ThemeProvider>
    </ColorSchemeContext.Provider>
  );
};

export default EmotionSystemProvider;
