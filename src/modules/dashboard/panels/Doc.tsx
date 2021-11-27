import React, { useRef, useState } from "react";
import AppShellContainer from "../../../components/app-shell/AppShellContainer";
import AppShellHeader from "../../../components/app-shell/AppShellHeader";
import { HStack } from "../../../components/layout/Stack";
import ColorModeButton from "../../../components/header/ColorModeButton";
import { useNavigate, useParams } from "react-router-dom";
import { useTh } from "../../../theme/hooks/use-th";
import { css } from "@emotion/react";
import {
  ActionIcon,
  Breadcrumbs,
  Button,
  Container,
  Menu,
  Popover,
  Skeleton,
  Title,
  Tooltip,
} from "@mantine/core";
import Tiptap from "../../../components/form/Tiptap";
import { Editor } from "@tiptap/react";
import useSafeSave from "../../../utils/use-safe-save";
import { useMount } from "react-use";
import useToast from "../../../utils/use-toast";
import useLoading from "../../../utils/use-loading";
import { Link } from "../../../components/Link";
import { Down, Pic } from "@icon-park/react";
import useNote from "../../../api/use-note";
import EmojiPicker from "../../../components/form/EmojiPicker";
import useBreadcrumbs from "../../../api/use-breadcrumbs";
import ContentEditable from "../../../components/form/ContentEditable";
import Flex from "../../../components/layout/Flex";
import PhotoPicker from "../../../components/form/PhotoPicker";

const Doc: React.FC = () => {
  const th = useTh();
  const toast = useToast();
  // route
  const navigate = useNavigate();
  const { id, mode } = useParams<"id" | "mode">();

  // note & breadcrumbs
  const note = useNote(id);
  const breadcrumbs = useBreadcrumbs(id);

  // editor
  const editor = useRef<Editor>(null);

  // save
  const saving = useLoading();
  const [enable, save] = useSafeSave(
    note.data,
    (data) => `doc:${data?.id}`,
    (data) => {
      if (!data) {
        return Promise.resolve();
      }
      return saving.wrap(
        note.$updateNote({
          name: data.name,
          content: data.content ?? undefined,
          attributes: data.attributes ?? undefined,
        })
      );
    }
  );

  // cover
  const [selectCover, setSelectCover] = useState(false);

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
                  note.mutate();
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
              <Link key={item.id} to={`/doc/${item.id}/${mode}`}>
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
                  onClick={() => navigate(`/doc/${item.id}/${mode}`)}
                >
                  {item.name}
                </Menu.Item>
              ))}
            </Menu>
          </Breadcrumbs>
        ) : (
          <Skeleton height={th.fontSize("lg")} width={th.fontSize(7)} />
        )}
        <HStack spacing="xs" align="center">
          <Button
            size="xs"
            loading={mode === "edit" && saving.loading}
            onClick={() => {
              if (mode === "edit") {
                save().then(() => navigate(`/doc/${id}/preview`));
              } else {
                navigate(`/doc/${id}/edit`);
              }
            }}
          >
            {mode === "edit" ? "保存" : "编辑"}
          </Button>
          <ColorModeButton />
        </HStack>
      </AppShellHeader>
      {note.attributes.cover ? (
        <Flex
          css={css`
            position: relative;
            height: ${th.spacing(80)};
            background-image: url(${note.attributes.cover as string});
            background-repeat: no-repeat;
            background-size: cover;
            background-position: 50%;

            > * {
              opacity: 0;
              transition: opacity 150ms;
            }

            &:hover > * {
              opacity: 1;
            }
          `}
        >
          <HStack
            spacing={1}
            css={css`
              position: absolute;
              bottom: ${th.spacing(4)};
              right: 25%;
            `}
          >
            <Popover
              opened={selectCover}
              onClose={() => setSelectCover(false)}
              position="bottom"
              spacing={0}
              withArrow
              target={
                <Button
                  variant="light"
                  size="xs"
                  compact
                  onClick={() => setSelectCover(true)}
                >
                  更换
                </Button>
              }
            >
              <PhotoPicker
                onSelect={(p) => {
                  note.$updateAttribute("cover", p?.url ?? null);
                  setSelectCover(false);
                }}
              />
            </Popover>
            <Button
              variant="light"
              size="xs"
              compact
              onClick={() => note.$updateAttribute("cover", null)}
            >
              移除
            </Button>
          </HStack>
        </Flex>
      ) : (
        <Flex
          justify="center"
          align="center"
          css={css`
            height: ${th.spacing(20)};
            border-bottom: 1px dashed ${th.color("gray.3", "gray.7")};
            opacity: 0;
            transition: opacity 150ms;

            &:hover {
              opacity: 1;
            }
          `}
        >
          <Button
            variant="light"
            compact
            leftIcon={<Pic />}
            onClick={() =>
              note.$updateAttribute("cover", "https://ixk.me/bg.jpg")
            }
          >
            添加题头图
          </Button>
        </Flex>
      )}
      <Container
        size="lg"
        css={css`
          width: 100%;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          margin-top: ${th.fontSize(-2)};
          margin-bottom: ${th.spacing(10)};
        `}
      >
        <EmojiPicker
          size={[th.theme.fontSizes.base * 3, th.theme.fontSizes.base * 4]}
          emoji={note.data?.icon || "spiral_note_pad"}
          onSelect={async (emoji) => {
            await note.$updateNote({ icon: emoji.id });
          }}
        />
        <Title
          order={1}
          css={css`
            font-weight: 500;
            margin-bottom: ${th.spacing(4)};
          `}
        >
          {note.data ? (
            <ContentEditable
              editable={mode === "edit"}
              placeholder="从撰写一个标题开始..."
              value={note.data?.name ?? ""}
              onChange={(value) =>
                note.set((prev) => ({
                  ...prev,
                  name: value,
                }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  editor.current?.commands.focus();
                }
              }}
            />
          ) : (
            <Skeleton height={th.fontSize("h1")} />
          )}
        </Title>
        <Tiptap
          ref={editor}
          editable={mode === "edit"}
          value={note.data?.content ?? `{"type":"doc"}`}
          onChange={(value) => {
            // update to memory
            note.set((prev) => ({
              ...prev,
              content: value,
            }));
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
