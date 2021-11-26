import React from "react";
import ReactDOM from "react-dom";
import { NormalizeCSS } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import App from "./App";
import GlobalStyles from "./theme/GlobalStyles";
import { theme } from "./theme";
import MantineProvider from "./theme/MantineProvider";
import { ModalsProvider } from "@mantine/modals";
import { SWRConfig } from "swr";
import { SWROutside } from "./utils/swr-outside";

const Root: React.FC = () => {
  return (
    <React.StrictMode>
      <SWRConfig>
        <SWROutside />
        <MantineProvider theme={theme}>
          <ModalsProvider>
            <NotificationsProvider position="top-center" limit={5} zIndex={999}>
              <NormalizeCSS />
              <GlobalStyles />
              <App />
            </NotificationsProvider>
          </ModalsProvider>
        </MantineProvider>
      </SWRConfig>
    </React.StrictMode>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));
