import React, { useRef } from "react";
import AppShellContainer from "../../../components/app-shell/AppShellContainer";
import AppShellHeader from "../../../components/app-shell/AppShellHeader";
import { HStack } from "../../../components/layout/Stack";
import ColorModeButton from "../../../components/header/ColorModeButton";
import { useNavigate, useParams } from "react-router-dom";
import { getNote, NoteView } from "../../../api/note";
import { useTh } from "../../../theme/hooks/use-th";
import { css } from "@emotion/react";
import { Button, Container, Title, Tooltip } from "@mantine/core";
import useSWRState from "../../../utils/use-swr-state";
import ContentEditable from "../../../components/form/ContentEditable";
import Tiptap from "../../../components/form/Tiptap";
import { Editor } from "@tiptap/react";
import useSafeSave from "../../../utils/use-safe-save";
import { useMount } from "react-use";
import useToast from "../../../utils/use-toast";
import useLoading from "../../../utils/use-loading";

const Doc: React.FC = () => {
  const th = useTh();
  const toast = useToast();
  // route
  const navigate = useNavigate();
  const { id, mode } = useParams<"id" | "mode">();

  // query & params
  const query = useSWRState(["getNote", id], async (key, id) => {
    const item = localStorage.getItem(`doc:${id}`);
    if (item) {
      return JSON.parse(item) as NoteView;
    }
    const entity = await getNote(id);
    return entity.data;
  });

  // editor
  const editor = useRef<Editor>(null);

  // save
  const [enable, save] = useSafeSave(
    query.data,
    (data) => `doc:${data?.id}`,
    (data) => {
      console.log(data);
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }
  );
  const saving = useLoading();

  useMount(() => {
    if (localStorage.getItem(`doc:${id}`)) {
      const message = toast.create({
        color: "orange",
        disallowClose: true,
        autoClose: false,
        title: "已恢复本地保存的文档",
        message: (
          <HStack
            css={css`
              margin-top: ${th.spacing(1)};
              justify-content: flex-end;
            `}
          >
            <Tooltip
              withArrow
              label="从云端加载会删除本地临时保存的修改，此操作无法恢复，请谨慎操作"
            >
              <Button
                size="xs"
                color="orange"
                onClick={() => {
                  localStorage.removeItem(`doc:${id}`);
                  query.mutate();
                  message.close();
                }}
              >
                从云端加载
              </Button>
            </Tooltip>
            <Tooltip
              withArrow
              label="笔记内容会优先从本地加载，此按钮仅关闭弹窗，如要将笔记保存到云端，请手动点击保存按钮"
            >
              <Button
                size="xs"
                color="green"
                onClick={() => {
                  message.close();
                }}
              >
                保留本地修改
              </Button>
            </Tooltip>
          </HStack>
        ),
      });
    }
  });

  return (
    <AppShellContainer>
      <AppShellHeader>
        <div />
        <HStack spacing="xs" align="center">
          <Button
            size="xs"
            loading={mode === "edit" && saving.loading}
            onClick={() => {
              if (mode === "edit") {
                saving.wrap(
                  save().then(() => navigate(`/dashboard/doc/${id}/preview`))
                );
              } else {
                navigate(`/dashboard/doc/${id}/edit`);
              }
            }}
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
            // update to memory
            const data = {
              ...(query.data as any),
              content: value,
            };
            query.setState(data);
            enable.current = true;
          }}
        />
      </Container>
    </AppShellContainer>
  );
};

export default function DocRemount() {
  // if id change, remount
  const { id } = useParams<"id">();
  return <Doc key={`doc:${id}`} />;
}
