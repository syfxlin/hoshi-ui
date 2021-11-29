import React, { useRef, useState } from "react";
import {
  AddWorkspaceView,
  ListNoteView,
  UpdateWorkspaceView,
  WorkspaceView,
} from "../../../api/note";
import {
  Box as BoxIcon,
  Copy,
  CopyLink,
  Delete,
  Editor,
  Move,
  OpenDoor,
  Plus,
  Refresh,
  Share,
} from "@icon-park/react";
import TreeButton from "../../../components/tree/TreeButton";
import TreeItem from "../../../components/tree/TreeItem";
import {
  ActionIcon,
  Button,
  Divider,
  InputWrapper,
  Menu,
  Modal,
  Switch,
  TextInput,
} from "@mantine/core";
import Tree from "../../../components/tree/Tree";
import { useTh } from "../../../theme/hooks/use-th";
import useForm from "../../../utils/use-form";
import Form from "../../../components/form/Form";
import { useNavigate, useParams } from "react-router-dom";
import { useWorkspaces } from "../../../api/use-workspaces";
import EmojiPicker from "../../../components/form/EmojiPicker";
import Async from "../../../components/Async";
import { TreeMethods } from "@minoru/react-dnd-treeview";
import { css } from "@emotion/react";
import Box from "../../../components/layout/Box";
import { link } from "../../../api/url";
import Omnibar from "../../../components/panel/Omnibar";

const WorkspaceTree: React.FC = () => {
  const th = useTh();
  const navigate = useNavigate();
  // params
  const { noteId } = useParams<"noteId">();
  // workspaces
  const workspaces = useWorkspaces();
  // tree
  const tree = useRef<TreeMethods>(null);
  // form
  const add = useForm<AddWorkspaceView>({
    initial: {
      name: "",
      description: "",
      domain: "",
      icon: "",
      disclose: false,
    },
    validate: {
      name: (value) => value.length > 0 || "工作区名称必须不为空",
    },
    handleSubmit: (values, loading) => {
      loading(
        workspaces
          .$addWorkspace({
            name: values.name,
            description: values.description || undefined,
            domain: values.domain || undefined,
            icon: values.icon || undefined,
            disclose: values.disclose,
          })
          .then(() => add.close())
      );
    },
  });
  const edit = useForm<UpdateWorkspaceView>({
    initial: {
      id: "",
      name: "",
      description: "",
      domain: "",
      icon: "",
      disclose: false,
    },
    handleSubmit: (values, loading) => {
      loading(
        workspaces
          .$updateWorkspace({
            id: values.id,
            name: values.name || undefined,
            description: values.description || undefined,
            domain: values.domain || undefined,
            icon: values.icon || undefined,
            disclose: values.disclose,
          })
          .then(() => edit.close())
      );
    },
  });
  // move note
  const [move, setMove] = useState<ListNoteView | null>(null);
  return (
    <Box
      css={css`
        flex-grow: 1;
        overflow-y: auto;
      `}
    >
      <Async query={workspaces}>
        <Tree
          tree={workspaces.values}
          rootId={0}
          treeRef={tree}
          canDrag={(node) => node?.parent !== 0}
          onDrop={(data, options) => {
            if (options.dragSource && options.dropTarget) {
              const note = options.dragSource.data as ListNoteView;
              const target = options.dropTarget.data;
              const isWorkspace = options.dropTarget.parent === 0;
              workspaces.$moveNote(
                note.id,
                isWorkspace ? target.id : target.workspace,
                isWorkspace ? "null" : target.id
              );
            }
          }}
          render={TreeItem<ListNoteView | WorkspaceView>({
            isActive: (node) => noteId === node.data?.id,
            onClick: (node) => {
              if (node.parent === 0) {
                navigate(`/workspace/${node.data?.id}`);
              } else {
                navigate(`/doc/${node.data?.id}/preview`);
              }
            },
            onLoad: async (node) => {
              if (node.parent === 0) {
                const data = node.data as WorkspaceView;
                await workspaces.$loadNotes(data.id);
              } else {
                const data = node.data as ListNoteView;
                await workspaces.$loadNotes(data.workspace, data.id);
              }
            },
            left: (node) => {
              return (
                <EmojiPicker
                  size={[th.theme.fontSizes.base, "xs"]}
                  emoji={
                    node.data?.icon ||
                    (node.parent === 0 ? "file_folder" : "spiral_note_pad")
                  }
                  onSelect={async (emoji) => {
                    const update =
                      node.parent === 0
                        ? workspaces.$updateWorkspace
                        : workspaces.$updateNote;
                    const data = node.data as WorkspaceView | ListNoteView;
                    await update({
                      id: data.id,
                      icon: emoji.id,
                    });
                  }}
                />
              );
            },
            text: (node) => node.text,
            right: (node) => (
              <ActionIcon
                size="xs"
                onClick={() => {
                  if (node.parent === 0) {
                    const data = node.data as WorkspaceView;
                    workspaces.$addNote({ workspace: data.id, name: "新页面" });
                  } else {
                    const data = node.data as ListNoteView;
                    workspaces.$addNote({
                      workspace: data.workspace,
                      parent: data.id,
                      name: "新页面",
                    });
                  }
                }}
              >
                <Plus />
              </ActionIcon>
            ),
            menu: (node) => (
              <>
                <Menu.Item
                  icon={<OpenDoor />}
                  onClick={() => {
                    if (node.parent === 0) {
                      navigate(`/workspace/${node.data?.id}`);
                    } else {
                      navigate(`/doc/${node.data?.id}/preview`);
                    }
                  }}
                >
                  查看
                </Menu.Item>
                <Menu.Item
                  icon={<Editor />}
                  onClick={() => {
                    if (node.parent === 0) {
                      const data = node.data as WorkspaceView;
                      edit.open({
                        id: data.id,
                        name: data.name,
                        description: data.description || "",
                        domain: data.domain || "",
                        icon: data.icon || "",
                        disclose: data.disclose,
                      });
                    } else {
                      const data = node.data as ListNoteView;
                      navigate(`/doc/${data.id}/edit`);
                    }
                  }}
                >
                  编辑
                </Menu.Item>
                <Divider />
                {node.parent !== 0 && (
                  <>
                    <Menu.Item
                      icon={<Share />}
                      onClick={() => {
                        const data = node.data as ListNoteView;
                        workspaces.$shareNote(data.id);
                      }}
                    >
                      {(node.data as ListNoteView).share ? "取消分享" : "分享"}
                    </Menu.Item>
                    <Menu.Item
                      icon={<Move />}
                      onClick={() => {
                        const data = node.data as ListNoteView;
                        setMove(data);
                      }}
                    >
                      移动
                    </Menu.Item>
                    <Divider />
                    <Menu.Item
                      icon={<CopyLink />}
                      onClick={() => {
                        const data = node.data as ListNoteView;
                        navigator.clipboard.writeText(link("share", data.id));
                      }}
                    >
                      复制分享链接
                    </Menu.Item>
                    <Menu.Item
                      icon={<Copy />}
                      onClick={() => {
                        const data = node.data as ListNoteView;
                        navigator.clipboard.writeText(data.id);
                      }}
                    >
                      复制页面 ID
                    </Menu.Item>
                    <Divider />
                    <Menu.Item
                      icon={<BoxIcon />}
                      color="orange"
                      onClick={() => {
                        const data = node.data as ListNoteView;
                        workspaces.$archiveNote(data.id);
                      }}
                    >
                      归档
                    </Menu.Item>
                  </>
                )}
                <Menu.Item
                  icon={<Delete />}
                  color="red"
                  onClick={() => {
                    if (node.parent === 0) {
                      const data = node.data as WorkspaceView;
                      workspaces.$deleteWorkspace(data.id);
                    } else {
                      const data = node.data as ListNoteView;
                      workspaces.$deleteNote(data.id);
                    }
                  }}
                >
                  删除
                </Menu.Item>
              </>
            ),
          })}
        />
      </Async>
      <TreeButton icon={<Plus />} onClick={() => add.open()}>
        增加工作区
      </TreeButton>
      <TreeButton
        icon={<Refresh />}
        onClick={() => {
          tree.current?.closeAll();
          workspaces.mutate();
        }}
      >
        刷新
      </TreeButton>
      <Modal opened={add.opened} onClose={() => add.close()} title="新增工作区">
        <Form onSubmit={add.onSubmit}>
          <TextInput
            required
            label="工作区名称"
            placeholder="工作区名称"
            value={add.values.name}
            onChange={(e) => add.setValue("name", e.currentTarget.value)}
            error={add.errors.name}
          />
          <TextInput
            label="工作区描述"
            placeholder="工作区描述"
            value={add.values.description}
            onChange={(e) => add.setValue("description", e.currentTarget.value)}
            error={add.errors.description}
          />
          <InputWrapper label="图标">
            <EmojiPicker
              size={[th.theme.fontSizes.base * 1.5, "lg"]}
              emoji={add.values.icon || "spiral_note_pad"}
              onSelect={async (emoji) => {
                add.setValue("icon", emoji.id || "");
              }}
            />
          </InputWrapper>
          <TextInput
            label="域名"
            placeholder="域名"
            value={add.values.domain}
            onChange={(e) => add.setValue("domain", e.currentTarget.value)}
            error={add.errors.domain}
          />
          <Switch
            label="是否公开"
            checked={add.values.disclose}
            onChange={(e) => add.setValue("disclose", e.currentTarget.checked)}
          />
          <Button type="submit" fullWidth loading={add.loading}>
            提交
          </Button>
        </Form>
      </Modal>
      <Modal
        opened={edit.opened}
        onClose={() => edit.close()}
        title={`修改工作区：${edit.values.id}`}
      >
        <Form onSubmit={edit.onSubmit}>
          <TextInput
            required
            label="工作区名称"
            placeholder="工作区名称"
            value={edit.values.name}
            onChange={(e) => edit.setValue("name", e.currentTarget.value)}
            error={edit.errors.name}
          />
          <TextInput
            label="工作区描述"
            placeholder="工作区描述"
            value={edit.values.description}
            onChange={(e) =>
              edit.setValue("description", e.currentTarget.value)
            }
            error={edit.errors.description}
          />
          <InputWrapper label="图标">
            <EmojiPicker
              size={[th.theme.fontSizes.base * 1.5, "lg"]}
              emoji={edit.values.icon || "spiral_note_pad"}
              onSelect={async (emoji) => {
                edit.setValue("icon", emoji.id || "");
              }}
            />
          </InputWrapper>
          <TextInput
            label="域名"
            placeholder="域名"
            value={edit.values.domain}
            onChange={(e) => edit.setValue("domain", e.currentTarget.value)}
            error={edit.errors.domain}
          />
          <Switch
            label="是否公开"
            checked={edit.values.disclose}
            onChange={(e) => edit.setValue("disclose", e.currentTarget.checked)}
          />
          <Button type="submit" fullWidth loading={edit.loading}>
            提交
          </Button>
        </Form>
      </Modal>
      <Omnibar
        opened={!!move}
        onClose={() => setMove(null)}
        placeholder="移动到..."
        onSelect={(note) => {
          if (move) {
            workspaces.$moveNote(move.id, note.workspace, note.id);
          }
          setMove(null);
        }}
      />
    </Box>
  );
};

export default WorkspaceTree;
