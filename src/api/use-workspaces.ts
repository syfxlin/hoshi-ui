import { NodeModel } from "../components/tree/TreeItem";
import {
  addNote,
  AddNoteView,
  addWorkspace,
  AddWorkspaceView,
  archiveNote,
  deleteNote,
  deleteWorkspace,
  forceDeleteNote,
  ListNoteView,
  listWorkspaces,
  NoteView,
  restoreNote,
  treeNotes,
  updateNote,
  UpdateNoteView,
  updateWorkspace,
  UpdateWorkspaceView,
  WorkspaceView,
} from "./note";
import useSWRMap from "../utils/use-swr-map";
import useToast from "../utils/use-toast";
import { useModals } from "@mantine/modals";
import { ApiEntity } from "./request";
import { useNavigate } from "react-router-dom";

export const useWorkspaces = (revalidateOnMount?: boolean) => {
  const toast = useToast();
  const modals = useModals();
  const navigate = useNavigate();

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
      revalidateOnMount: revalidateOnMount ?? true,
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
        navigate(`/workspace/${data.id}`);
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
    const entity = await treeNotes(workspace, parent);
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
    new Promise((resolve, reject) => {
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
            .then((res) => {
              query.remove(id);
              resolve(res);
            })
            .catch(
              toast.api.error({
                title: "删除失败",
              })
            )
            .catch((err) => reject(err));
        },
      });
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
        navigate(`/doc/${data.id}`);
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

  const $archiveNote = (id: string) =>
    archiveNote(id)
      .then(
        toast.api.success({
          title: "归档成功",
        })
      )
      .then((res) => {
        query.remove(id);
        return res;
      })
      .catch(
        toast.api.error({
          title: "归档失败",
        })
      );

  const $deleteNote = (id: string) =>
    new Promise<ApiEntity>((resolve, reject) => {
      modals.openConfirmModal({
        title: "确认删除该笔记？",
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
            .then((res) => {
              query.remove(id);
              resolve(res);
            })
            .catch(
              toast.api.error({
                title: "删除失败",
              })
            )
            .catch((err) => reject(err));
        },
      });
    });

  const $restoreNote = (id: string) =>
    restoreNote(id)
      .then(
        toast.api.success({
          title: "恢复成功",
        })
      )
      .then((res) => {
        query.mutate();
        return res;
      })
      .catch(
        toast.api.error({
          title: "恢复失败",
        })
      );

  const $forceDeleteNote = (id: string) =>
    new Promise((resolve, reject) => {
      modals.openConfirmModal({
        title: "确认永久删除该笔记？",
        labels: {
          confirm: "确认删除",
          cancel: "取消删除",
        },
        confirmProps: {
          color: "red",
        },
        onConfirm: () => {
          forceDeleteNote(id)
            .then(
              toast.api.success({
                title: "永久删除成功",
              })
            )
            .then((res) => {
              query.remove(id);
              resolve(res);
            })
            .catch(
              toast.api.error({
                title: "永久删除失败",
              })
            )
            .catch((err) => reject(err));
        },
      });
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
    $archiveNote,
    $deleteNote,
    $restoreNote,
    $forceDeleteNote,
  };
};
