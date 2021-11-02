import React from "react";
import { css, Global } from "@emotion/react";
import { useTh } from "./hooks/use-th";

const GlobalStyles: React.FC = () => {
  const th = useTh();
  return (
    <Global
      styles={css`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        body {
          font-family: ${th.font("sans") || "sans-serif"};
          background-color: ${th.color("gray.0", "dark.7")};
          color: ${th.color("black", "dark.0")};
          line-height: ${th.lineHeight("md")};
        }

        html,
        body,
        #root,
        .App {
          min-height: 100vh;
        }

        .App {
          display: flex;
          flex-direction: column;
        }

        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          border-radius: 3px;
          background: rgba(0, 0, 0, 0.06);
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.08);
        }

        ::-webkit-scrollbar-thumb {
          border-radius: 3px;
          background: rgba(0, 0, 0, 0.12);
          box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
        }

        .Pane {
          display: flex;
        }

        .Resizer {
          opacity: 0.2;
          z-index: 1;
          box-sizing: border-box;
          background-clip: padding-box;
          transition: background-color 0.5s ease;

          &:hover {
            background-color: ${th.color("gray.9", "dark.0")};
          }

          &.horizontal {
            height: 12px;
            margin: -6px 0;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            cursor: row-resize;
            width: 100%;
          }

          &.vertical {
            width: 12px;
            margin: 0 -6px;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            cursor: col-resize;
          }

          &.disabled {
            cursor: not-allowed;

            &:hover {
              border-color: transparent;
            }
          }
        }

        .i-icon {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}
    />
  );
};

export default GlobalStyles;
