import { NodeModel } from "../components/tree/TreeItem";
import {
  addNote,
  AddNoteView,
  addWorkspace,
  AddWorkspaceView,
  deleteNote,
  deleteWorkspace,
  listNotes,
  ListNoteView,
  listWorkspaces,
  NoteView,
  updateNote,
  UpdateNoteView,
  updateWorkspace,
  UpdateWorkspaceView,
  WorkspaceView,
} from "./note";
import useSWRMap from "../utils/use-swr-map";
import useToast from "../utils/use-toast";
import { useModals } from "@mantine/modals";

export const useWorkspaces = () => {
  const toast = useToast();
  const modals = useModals();

  const query = useSWRMap<
    string | number,
    NodeModel<WorkspaceView | ListNoteView>
  >(
    "workspaces",
    async () => {
      const entity = await listWorkspaces();
      return new Map(
        entity.data?.map<[string, NodeModel<WorkspaceView>]>((w) => [
          w.id,
          {
            id: w.id,
            parent: 0,
            text: w.name,
            droppable: true,
            loaded: false,
            data: w,
          },
        ])
      );
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
    }
  );

  const $addWorkspace = (workspace: AddWorkspaceView) =>
    addWorkspace(workspace)
      .then(
        toast.api.success({
          title: "新增成功",
        })
      )
      .then((res) => {
        const data = res.data as WorkspaceView;
        query.add(data.id, {
          id: data.id,
          parent: 0,
          text: data.name,
          droppable: true,
          loaded: false,
          data,
        });
        return res;
      })
      .catch(
        toast.api.error({
          title: "新增失败",
        })
      );

  const $loadNotes = async (workspace: string, parent?: string) => {
    const id = parent ?? workspace;
    await query.set(id, (prev) => ({
      ...prev,
      loaded: "loading",
    }));
    const entity = await listNotes(workspace, parent);
    await query.addAll(
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
    await query.set(id, (prev) => ({
      ...prev,
      loaded: true,
    }));
  };

  const $updateWorkspace = (workspace: UpdateWorkspaceView) =>
    updateWorkspace(workspace)
      .then((res) => {
        const data = res.data as WorkspaceView;
        query.set(data.id, (prev) => ({
          ...prev,
          id: data.id,
          text: data.name,
          data,
        }));
        return res;
      })
      .catch(
        toast.api.error({
          title: "修改图标失败",
        })
      );

  const $deleteWorkspace = (id: string) =>
    modals.openConfirmModal({
      title: "确认删除该工作区？",
      labels: {
        confirm: "确认删除",
        cancel: "取消删除",
      },
      confirmProps: {
        color: "red",
      },
      onConfirm: () => {
        deleteWorkspace(id)
          .then(
            toast.api.success({
              title: "删除成功",
            })
          )
          .then(() => {
            query.remove(id);
          })
          .catch(
            toast.api.error({
              title: "删除失败",
            })
          );
      },
    });

  const $addNote = (note: AddNoteView) =>
    addNote(note)
      .then((res) => {
        const data = res.data as ListNoteView;
        query.add(data.id, {
          id: data.id,
          parent: data.parent ?? data.workspace,
          text: data.name,
          droppable: true,
          loaded: false,
          data,
        });
        return res;
      })
      .catch(
        toast.api.error({
          title: "新增失败",
        })
      );

  const $updateNote = (note: UpdateNoteView) =>
    updateNote(note)
      .then((res) => {
        const data = res.data as NoteView;
        query.set(data.id, (prev) => ({
          ...prev,
          id: data.id,
          parent: data.parent ?? data.workspace,
          text: data.name,
          data,
        }));
        return res;
      })
      .catch(
        toast.api.error({
          title: "修改图标失败",
        })
      );

  const $moveNote = (id: string, workspace: string, parent?: string) =>
    updateNote({
      id,
      workspace,
      parent,
    })
      .then((res) => {
        const data = res.data as NoteView;
        query.set(id, (prev) => ({
          ...prev,
          id: data.id,
          parent: data.parent ?? data.workspace,
          text: data.name,
          data,
        }));
        return res;
      })
      .catch(
        toast.api.error({
          title: "移动失败",
        })
      );

  const $deleteNote = (id: string) =>
    modals.openConfirmModal({
      title: "确认删除该工笔记？",
      labels: {
        confirm: "确认删除",
        cancel: "取消删除",
      },
      confirmProps: {
        color: "red",
      },
      onConfirm: () => {
        deleteNote(id)
          .then(
            toast.api.success({
              title: "删除成功",
            })
          )
          .then(() => {
            query.remove(id);
          })
          .catch(
            toast.api.error({
              title: "删除失败",
            })
          );
      },
    });

  return {
    ...query,
    $addWorkspace,
    $moveNote,
    $loadNotes,
    $updateWorkspace,
    $updateNote,
    $addNote,
    $deleteWorkspace,
    $deleteNote,
  };
};
