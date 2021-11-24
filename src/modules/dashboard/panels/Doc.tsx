import React, { useRef } from "react";
import AppShellContainer from "../../../components/app-shell/AppShellContainer";
import AppShellHeader from "../../../components/app-shell/AppShellHeader";
import { HStack } from "../../../components/layout/Stack";
import ColorModeButton from "../../../components/header/ColorModeButton";
import { useNavigate, useParams } from "react-router-dom";
import { getNote } from "../../../api/note";
import { useTh } from "../../../theme/hooks/use-th";
import { css } from "@emotion/react";
import { Button, Container, Title } from "@mantine/core";
import useSWRState from "../../../utils/use-swr-state";
import ContentEditable from "../../../components/form/ContentEditable";
import { useLocalStorageValue } from "@mantine/hooks";
import Tiptap from "../../../components/form/Tiptap";
import { Editor } from "@tiptap/react";

const Doc: React.FC = () => {
  const th = useTh();
  // route
  const navigate = useNavigate();
  const { id, mode } = useParams<"id" | "mode">();
  // query & params
  const query = useSWRState(["getNote", id], (key, id) =>
    getNote(id).then((entity) => entity.data)
  );
  const editor = useRef<Editor>(null);
  const [storage, setStorage] = useLocalStorageValue({ key: `doc:${id}` });

  return (
    <AppShellContainer>
      <AppShellHeader>
        <div />
        <HStack spacing="xs" align="center">
          <Button
            size="xs"
            onClick={() =>
              navigate(
                `/dashboard/doc/${id}/${mode === "edit" ? "preview" : "edit"}`
              )
            }
          >
            {mode === "edit" ? "保存" : "编辑"}
          </Button>
          <ColorModeButton />
        </HStack>
      </AppShellHeader>
      <Container
        size="lg"
        css={css`
          width: 100%;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          margin-top: ${th.spacing(10)};
          margin-bottom: ${th.spacing(10)};
        `}
      >
        <Title
          order={1}
          css={css`
            font-weight: 500;
            margin-bottom: ${th.spacing(4)};
          `}
        >
          <ContentEditable
            placeholder="从撰写一个标题开始..."
            value={query.data?.name ?? ""}
            onChange={(value) =>
              query.setState({
                ...(query.data as any),
                name: value,
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                editor.current?.commands.focus();
              }
            }}
          />
        </Title>
        <Tiptap
          ref={editor}
          editable={mode === "edit"}
          value={query.data?.content ?? `{"type":"doc"}`}
          onChange={(value) => {
            query.setState({
              ...(query.data as any),
              content: value,
            });
          }}
        />
      </Container>
    </AppShellContainer>
  );
};

export default Doc;
