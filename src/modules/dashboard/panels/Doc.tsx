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
  Alert,
  Breadcrumbs,
  Button,
  Container,
  Divider,
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
import { Copy, CopyLink, Delete, More, Move, Pic } from "@icon-park/react";
import useNote from "../../../api/use-note";
import EmojiPicker from "../../../components/form/EmojiPicker";
import ContentEditable from "../../../components/form/ContentEditable";
import Flex from "../../../components/layout/Flex";
import PhotoPicker from "../../../components/form/PhotoPicker";
import { NoteStatus } from "../../../api/note";
import { Box as BoxIcon } from "@icon-park/react/lib/map";
import { link } from "../../../api/url";
import Omnibar from "../../../components/panel/Omnibar";

const Doc: React.FC = () => {
  const th = useTh();
  const toast = useToast();
  // route
  const navigate = useNavigate();
  const { noteId: id, mode } = useParams<"noteId" | "mode">();

  // note & breadcrumbs
  const note = useNote(id);

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
        note
          .$updateNote({
            name: data.name,
            content: data.content ?? undefined,
            attributes: data.attributes ?? undefined,
          })
          .then(() => {
            enable.current = false;
          })
      );
    }
  );

  // cover
  const [selectCover, setSelectCover] = useState(false);
  // move note
  const [move, setMove] = useState<boolean>(false);

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
        {note.data ? (
          <Breadcrumbs>
            <Link to={`/workspace/${note.data.breadcrumb.workspace.id}`}>
              {note.data.breadcrumb.workspace.name}
            </Link>
            {note.data.breadcrumb.parent.map((item) => (
              <Link key={item.id} to={`/doc/${item.id}/${mode}`}>
                {item.name}
              </Link>
            ))}
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
          <Menu
            withArrow
            placement="end"
            control={
              <ActionIcon variant="light" color={th.primaryColor}>
                <More />
              </ActionIcon>
            }
          >
            <Menu.Item icon={<Move />} onClick={() => setMove(true)}>
              移动
            </Menu.Item>
            <Divider />
            <Menu.Item
              icon={<CopyLink />}
              onClick={() =>
                note.data &&
                navigator.clipboard.writeText(link("share", note.data.id))
              }
            >
              复制分享链接
            </Menu.Item>
            <Menu.Item
              icon={<Copy />}
              onClick={() =>
                note.data && navigator.clipboard.writeText(note.data.id)
              }
            >
              复制页面 ID
            </Menu.Item>
            <Divider />
            <Menu.Item
              color="orange"
              icon={<BoxIcon />}
              onClick={() => note.$archiveNote()}
            >
              归档
            </Menu.Item>
            <Menu.Item
              color="red"
              icon={<Delete />}
              onClick={() => note.$deleteNote()}
            >
              删除
            </Menu.Item>
            <Divider />
            <Menu.Label>
              最后修改时间：
              <br />
              {note.data && new Date(note.data.updatedTime).toLocaleString()}
            </Menu.Label>
            <Menu.Label>
              创建时间：
              <br />
              {note.data && new Date(note.data.createdTime).toLocaleString()}
            </Menu.Label>
          </Menu>
          <ColorModeButton />
        </HStack>
      </AppShellHeader>
      {note.data?.status === NoteStatus.ARCHIVE && (
        <Alert color="orange">
          <HStack justify="center" align="center" spacing={2}>
            <span>此笔记已归档</span>
            <Button
              size="xs"
              variant="outline"
              onClick={() => note.$restoreNote()}
            >
              还原笔记
            </Button>
            <Button
              size="xs"
              variant="outline"
              color="red"
              onClick={() => note.$deleteNote()}
            >
              删除
            </Button>
          </HStack>
        </Alert>
      )}
      {note.data?.status === NoteStatus.DELETED && (
        <Alert color="red">
          <HStack justify="center" align="center" spacing={2}>
            <span>此笔记位于回收站中</span>
            <Button
              size="xs"
              variant="outline"
              onClick={() => note.$restoreNote()}
            >
              还原笔记
            </Button>
            <Button
              size="xs"
              variant="outline"
              color="red"
              onClick={() => note.$forceDeleteNote()}
            >
              永久删除
            </Button>
          </HStack>
        </Alert>
      )}
      {note.attributes.cover ? (
        <Flex
          css={css`
            position: relative;
            height: ${th.spacing(80)};
            background-image: url(${note.attributes.cover as string});
            background-repeat: no-repeat;
            background-size: cover;
            background-position: 50%;
            flex: 0 0 ${th.spacing(80)};

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
      <Omnibar
        opened={move}
        onClose={() => setMove(false)}
        placeholder="移动到..."
        onSelect={(parent) => {
          note.$moveNote(parent.workspace, parent.id);
          setMove(false);
        }}
      />
    </AppShellContainer>
  );
};

export default function DocRemount() {
  // if id change, remount
  const { noteId } = useParams<"noteId">();
  return <Doc key={`doc:${noteId}`} />;
}
