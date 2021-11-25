import React, { useState } from "react";
import {
  addNote,
  addWorkspace,
  deleteNote,
  deleteWorkspace,
  listNotes,
  ListNoteView,
  updateNote,
  updateWorkspace,
  WorkspaceView,
} from "../../../api/note";
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
import "emoji-mart/css/emoji-mart.css";
import { Emoji, Picker } from "emoji-mart";
import { ApiEntity } from "../../../api/request";
import { useTh } from "../../../theme/hooks/use-th";
import useForm from "../../../utils/use-form";
import useToast from "../../../utils/use-toast";
import Form from "../../../components/form/Form";
import { useModals } from "@mantine/modals";
import { useNavigate, useParams } from "react-router-dom";
import { useWorkspaces } from "../../../api/use-workspace";

const WorkspaceTree: React.FC = () => {
  const th = useTh();
  const toast = useToast();
  const modals = useModals();
  const navigate = useNavigate();
  const { id } = useParams<"id">();
  // tree
  const tree = useWorkspaces();
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
      loading(
        addWorkspace(workspace)
          .then(
            toast.api.success({
              title: "新增成功",
            })
          )
          .then((res) => {
            const data = res.data as WorkspaceView;
            tree.put(data.id, {
              id: data.id,
              parent: 0,
              text: data.name,
              droppable: true,
              loaded: false,
              data,
            });
            add.reset();
          })
          .catch(
            toast.api.error({
              title: "新增失败",
            })
          )
      );
    },
  });
  return (
    <>
      <Tree
        tree={[...(tree.data?.values() ?? [])]}
        rootId={0}
        canDrag={(node) => node?.parent !== 0}
        onDrop={(data, options) => {
          if (options.dragSource && options.dropTarget) {
            const note = options.dragSource.data as ListNoteView;
            const target = options.dropTarget.data;
            const isWorkspace = options.dropTarget.parent === 0;
            updateNote(note.id, {
              workspace: isWorkspace ? target.id : target.workspace,
              parent: isWorkspace ? "null" : target.id,
            })
              .then(() => {
                tree.update(options.dragSourceId, {
                  parent: options.dropTargetId,
                });
              })
              .catch(
                toast.api.error({
                  title: "移动失败",
                })
              );
          }
        }}
        render={TreeItem<ListNoteView | WorkspaceView>({
          onClick: (node) => {
            if (node.parent !== 0) {
              navigate(`/dashboard/doc/${node.data?.id}/preview`);
            }
          },
          isActive: (node) => id === node.data?.id,
          onLoad: async (node) => {
            tree.update(node.id, {
              loaded: "loading",
            });
            let entity: ApiEntity<ListNoteView[]>;
            if (node.parent === 0) {
              const data = node.data as WorkspaceView;
              entity = await listNotes(data.id);
            } else {
              const data = node.data as ListNoteView;
              entity = await listNotes(data.workspace, data.id);
            }
            tree.update(node.id, {
              loaded: true,
            });
            tree.putAll(
              entity.data?.map((n) => [
                n.id,
                {
                  id: n.id,
                  parent: n.parent ?? n.workspace,
                  text: n.name,
                  droppable: true,
                  loaded: false,
                  data: n,
                },
              ])
            );
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
                      node.parent === 0 ? updateWorkspace : updateNote;
                    const data = node.data as WorkspaceView | ListNoteView;
                    update(data.id, {
                      icon: emoji.id,
                    })
                      .then(() => {
                        tree.put(node.id, {
                          ...node,
                          data: {
                            ...data,
                            icon: emoji.id,
                          },
                        });
                        setOpened(false);
                      })
                      .catch(
                        toast.api.error({
                          title: "修改图标失败",
                        })
                      );
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
                  addNote(
                    {
                      name: "新页面",
                    },
                    data.id
                  )
                    .then((res) => {
                      const data = res.data as ListNoteView;
                      tree.put(data.id, {
                        id: data.id,
                        parent: data.parent ?? data.workspace,
                        text: data.name,
                        droppable: true,
                        loaded: false,
                        data,
                      });
                    })
                    .catch(
                      toast.api.error({
                        title: "新增失败",
                      })
                    );
                } else {
                  const data = node.data as ListNoteView;
                  addNote(
                    {
                      name: "新页面",
                    },
                    data.workspace,
                    data.id
                  )
                    .then((res) => {
                      const data = res.data as ListNoteView;
                      tree.put(data.id, {
                        id: data.id,
                        parent: data.parent ?? data.workspace,
                        text: data.name,
                        droppable: true,
                        loaded: false,
                        data,
                      });
                    })
                    .catch(
                      toast.api.error({
                        title: "新增失败",
                      })
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
                  modals.openConfirmModal({
                    title: "确认删除该工作区/笔记？",
                    labels: {
                      confirm: "确认删除",
                      cancel: "取消删除",
                    },
                    confirmProps: {
                      color: "red",
                    },
                    onConfirm: () => {
                      if (node.parent === 0) {
                        const data = node.data as WorkspaceView;
                        deleteWorkspace(data.id)
                          .then(
                            toast.api.success({
                              title: "删除成功",
                            })
                          )
                          .then(() => {
                            tree.remove(node.id);
                          })
                          .catch(
                            toast.api.error({
                              title: "删除失败",
                            })
                          );
                      } else {
                        const data = node.data as ListNoteView;
                        deleteNote(data.id)
                          .then(
                            toast.api.success({
                              title: "删除成功",
                            })
                          )
                          .then(() => {
                            tree.remove(node.id);
                          })
                          .catch(
                            toast.api.error({
                              title: "删除失败",
                            })
                          );
                      }
                    },
                  });
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
