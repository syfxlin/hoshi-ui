import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import { NormalizeCSS } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import App from "./App";
import GlobalStyles from "./theme/GlobalStyles";
import { theme } from "./theme";
import MantineProvider from "./theme/MantineProvider";

const Root: React.FC = () => {
  return (
    <React.StrictMode>
      <RecoilRoot>
        <MantineProvider theme={theme}>
          <NotificationsProvider position="top-center" limit={5}>
            <NormalizeCSS />
            <GlobalStyles />
            <App />
          </NotificationsProvider>
        </MantineProvider>
      </RecoilRoot>
    </React.StrictMode>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));
