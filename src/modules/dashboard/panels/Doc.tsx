import React, { useRef } from "react";
import AppShellContainer from "../../../components/app-shell/AppShellContainer";
import AppShellHeader from "../../../components/app-shell/AppShellHeader";
import { HStack } from "../../../components/layout/Stack";
import ColorModeButton from "../../../components/header/ColorModeButton";
import { useNavigate, useParams } from "react-router-dom";
import {
  getBreadcrumb,
  getNote,
  NoteView,
  updateNote,
} from "../../../api/note";
import { useTh } from "../../../theme/hooks/use-th";
import { css } from "@emotion/react";
import {
  ActionIcon,
  Breadcrumbs,
  Button,
  Container,
  Menu,
  Title,
  Tooltip,
} from "@mantine/core";
import useSWRState from "../../../utils/use-swr-state";
import ContentEditable from "../../../components/form/ContentEditable";
import Tiptap from "../../../components/form/Tiptap";
import { Editor } from "@tiptap/react";
import useSafeSave from "../../../utils/use-safe-save";
import { useMount } from "react-use";
import useToast from "../../../utils/use-toast";
import useLoading from "../../../utils/use-loading";
import useSWR from "swr";
import { Link } from "../../../components/Link";
import { Down } from "@icon-park/react";

const Doc: React.FC = () => {
  const th = useTh();
  const toast = useToast();
  // route
  const navigate = useNavigate();
  const { id, mode } = useParams<"id" | "mode">();

  // query & params
  const breadcrumbs = useSWR(["getBreadcrumb", id], async (key, id) => {
    const entity = await getBreadcrumb(id);
    return entity.data;
  });

  const query = useSWRState(["getNote", id], async (key, id) => {
    const item = localStorage.getItem(`doc:${id}`);
    if (item) {
      return JSON.parse(item).data as NoteView;
    }
    const entity = await getNote(id);
    return entity.data;
  });

  // TODO: 改进修改
  // const tree = useWorkspaces();
  // useEffect(() => {
  //   if (query.data) {
  //     tree.update(query.data.id, {
  //       text: query.data.name,
  //     });
  //   }
  // }, [query.data]);

  // editor
  const editor = useRef<Editor>(null);

  // save
  const saving = useLoading();
  const [enable, save] = useSafeSave(
    query.data,
    (data) => `doc:${data?.id}`,
    (data) => {
      if (!data) {
        return Promise.resolve();
      }
      return saving.wrap(
        updateNote(data.id, {
          name: data.name,
          content: data.content ?? undefined,
          attributes: data.attributes ?? undefined,
        }).catch(
          toast.api.error({
            title: "修改笔记失败",
          })
        )
      );
    }
  );

  useMount(() => {
    const item = localStorage.getItem(`doc:${id}`);
    if (item) {
      const message = toast.create({
        color: "orange",
        disallowClose: true,
        autoClose: false,
        title: `已恢复本地保存的文档，保存自 ${new Date(
          JSON.parse(item).time
        ).toLocaleString()}`,
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
        {breadcrumbs.data ? (
          <Breadcrumbs>
            <Link to={`/dashboard/workspace/${breadcrumbs.data.workspace.id}`}>
              {breadcrumbs.data.workspace.name}
            </Link>
            {breadcrumbs.data.parent.map((item) => (
              <Link key={item.id} to={`/dashboard/doc/${item.id}/${mode}`}>
                {item.name}
              </Link>
            ))}
            <Menu
              control={
                <ActionIcon size="xs">
                  <Down />
                </ActionIcon>
              }
            >
              {breadcrumbs.data.children.map((item) => (
                <Menu.Item
                  key={item.id}
                  onClick={() => navigate(`/dashboard/doc/${item.id}/${mode}`)}
                >
                  {item.name}
                </Menu.Item>
              ))}
            </Menu>
          </Breadcrumbs>
        ) : (
          <div />
        )}
        <HStack spacing="xs" align="center">
          <Button
            size="xs"
            loading={mode === "edit" && saving.loading}
            onClick={() => {
              if (mode === "edit") {
                save().then(() => navigate(`/dashboard/doc/${id}/preview`));
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
              query.update({
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
            query.update({
              content: value,
            });
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
