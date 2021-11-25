import React, { useState } from "react";
import { ListNoteView, WorkspaceView } from "../../../api/note";
import { Delete, Facebook, Plus } from "@icon-park/react";
import TreeButton from "../../../components/tree/TreeButton";
import TreeItem from "../../../components/tree/TreeItem";
import {
  ActionIcon,
  Button,
  Divider,
  Menu,
  Modal,
  Popover,
  Switch,
  TextInput,
} from "@mantine/core";
import Tree from "../../../components/tree/Tree";
import { Emoji, Picker } from "emoji-mart-virtualized";
import { useTh } from "../../../theme/hooks/use-th";
import useForm from "../../../utils/use-form";
import Form from "../../../components/form/Form";
import { useNavigate, useParams } from "react-router-dom";
import { useWorkspaces } from "../../../api/use-workspace";

const WorkspaceTree: React.FC = () => {
  const th = useTh();
  const navigate = useNavigate();
  // params
  const { id } = useParams<"id">();
  // workspaces
  const workspaces = useWorkspaces();
  // form
  const add = useForm({
    initial: {
      opened: false,
      name: "",
      description: "",
      domain: "",
      icon: "",
      disclose: false,
    },
    validate: {
      name: (value) => value.length > 0 || "工作区名称必须不为空",
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleSubmit: ({ opened, ...workspace }, loading) => {
      loading(workspaces.$addWorkspace(workspace).then(() => add.reset()));
    },
  });
  return (
    <>
      <Tree
        tree={[...(workspaces.data?.values() ?? [])]}
        rootId={0}
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
          isActive: (node) => id === node.data?.id,
          onClick: (node) => {
            if (node.parent !== 0) {
              navigate(`/dashboard/doc/${node.data?.id}/preview`);
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
            const [opened, setOpened] = useState(false);
            return (
              <Popover
                opened={opened}
                onClose={() => setOpened(false)}
                withArrow
                spacing={0}
                target={
                  <ActionIcon size="xs" onClick={() => setOpened(!opened)}>
                    <Emoji
                      set="twitter"
                      size={th.theme.fontSizes.base}
                      emoji={
                        node.data?.icon ||
                        (node.parent === 0 ? "file_folder" : "spiral_note_pad")
                      }
                    />
                  </ActionIcon>
                }
              >
                <Picker
                  set="twitter"
                  style={{ border: "none" }}
                  onSelect={(emoji) => {
                    const update =
                      node.parent === 0
                        ? workspaces.$updateWorkspaceIcon
                        : workspaces.$updateNoteIcon;
                    const data = node.data as WorkspaceView | ListNoteView;
                    update(data.id, emoji.id).then(() => setOpened(false));
                  }}
                />
              </Popover>
            );
          },
          text: (node) => node.text,
          right: (node) => (
            <ActionIcon
              size="xs"
              onClick={() => {
                if (node.parent === 0) {
                  const data = node.data as WorkspaceView;
                  workspaces.$addNote({ name: "新页面" }, data.id);
                } else {
                  const data = node.data as ListNoteView;
                  workspaces.$addNote(
                    { name: "新页面" },
                    data.workspace,
                    data.id
                  );
                }
              }}
            >
              <Plus />
            </ActionIcon>
          ),
          menu: (node) => (
            <>
              <Menu.Item icon={<Facebook />}>Settings</Menu.Item>
              <Menu.Item icon={<Facebook />}>Messages</Menu.Item>
              <Divider />
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
      <TreeButton icon={<Plus />} onClick={() => add.setValue("opened", true)}>
        增加工作区
      </TreeButton>
      <Modal
        opened={add.values.opened}
        onClose={() => add.reset()}
        title="新增工作区"
      >
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
    </>
  );
};

export default WorkspaceTree;
