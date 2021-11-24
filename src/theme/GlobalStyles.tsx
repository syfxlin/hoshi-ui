import React from "react";
import { css, Global } from "@emotion/react";
import { useTh } from "./hooks/use-th";
import "katex/dist/katex.css";

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
          background-color: ${th.color("white", "dark.7")};
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

        // tiptap
        :root {
          --tiptap-color-text: ${th.color("black", "dark.0")};
          --tiptap-color-text-secondly: ${th.color("gray.5", "gray.7")};
          --tiptap-color-background: ${th.color("white", "dark.7")};
          --tiptap-color-background-hover: ${th.color("gray.3", "gray.7")};
          --tiptap-color-background-secondly: ${th.color("gray.0", "dark.7")};
          --tiptap-color-border: ${th.color("gray.4", "gray.8")};
          --tiptap-color-reverse-text: ${th.color("white", "dark.7")};
          --tiptap-color-reverse-text-secondly: ${th.color("gray.0", "dark.7")};
          --tiptap-color-reverse-background: ${th.color("dark.7", "gray.0")};
          --tiptap-color-reverse-bakcground-secondly: ${th.color(
            "dark.4",
            "gray.4"
          )};
          --tiptap-color-primary: ${th.color("primary.7")};
          --tiptap-color-selected: #8cf;
          --tiptap-color-code: ${th.color("red.9")};
          --tiptap-color-mark: ${th.color("yellow.2")};
          --tiptap-font-family: ${th.font("sans")};
          --tiptap-font-family-mono: ${th.font("mono")};
          --tiptap-font-weight: 400;
          --tiptap-font-size: ${th.fontSize("md")};
          --tiptap-line-height: 1.7;
        }

        .tippy-box[data-animation="shift-away"][data-state="hidden"] {
          opacity: 0;
        }

        .tippy-box[data-animation="shift-away"][data-state="hidden"][data-placement^="top"] {
          transform: translateY(10px);
        }

        .tippy-box[data-animation="shift-away"][data-state="hidden"][data-placement^="bottom"] {
          transform: translateY(-10px);
        }

        .tippy-box[data-animation="shift-away"][data-state="hidden"][data-placement^="left"] {
          transform: translateX(10px);
        }

        .tippy-box[data-animation="shift-away"][data-state="hidden"][data-placement^="right"] {
          transform: translateX(-10px);
        }
      `}
    />
  );
};

export default GlobalStyles;
