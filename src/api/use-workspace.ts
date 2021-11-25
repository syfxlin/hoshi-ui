import useSWR from "swr";
import { ApiEntity, request } from "./request";
import { useCallback } from "react";
import { NodeModel } from "../components/tree/TreeItem";
import { ListNoteView, WorkspaceView } from "./note";

export const useWorkspaces = () => {
  const query = useSWR<
    Map<string | number, NodeModel<WorkspaceView | ListNoteView>>
  >(
    "workspaces",
    async () => {
      const response = await request.get<ApiEntity<WorkspaceView[]>>(
        `/hoshi-note/workspaces`
      );
      const workspaces = response.data.data;
      return new Map(
        workspaces?.map<[string, NodeModel<WorkspaceView>]>((w) => [
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

  const put = useCallback(
    (key: string | number, value: NodeModel<WorkspaceView | ListNoteView>) => {
      query.mutate((prev) => {
        const clone = new Map(prev ?? []);
        clone.set(key, value);
        return clone;
      });
    },
    [query.mutate]
  );

  const remove = useCallback(
    (key: string | number) => {
      query.mutate((prev) => {
        const clone = new Map(prev ?? []);
        clone.delete(key);
        return clone;
      });
    },
    [query.mutate]
  );

  const putAll = useCallback(
    (
      entries?: [string | number, NodeModel<WorkspaceView | ListNoteView>][]
    ) => {
      if (!entries) {
        return;
      }
      query.mutate((prev) => {
        const clone = new Map(prev ?? []);
        entries.forEach(([key, value]) => clone.set(key, value));
        return clone;
      });
    },
    [query.mutate]
  );

  const removeAll = useCallback(
    (keys?: (string | number)[]) => {
      if (!keys) {
        return;
      }
      query.mutate((prev) => {
        const clone = new Map(prev ?? []);
        keys.forEach((key) => clone.delete(key));
        return clone;
      });
    },
    [query.mutate]
  );

  const update = useCallback(
    (
      key: string | number,
      value: Partial<NodeModel<WorkspaceView | ListNoteView>>
    ) => {
      query.mutate((prev) => {
        const v = prev?.get(key);
        if (!v) {
          return prev;
        }
        const clone = new Map(prev ?? []);
        clone.set(key, {
          ...v,
          ...value,
        });
        return clone;
      });
    },
    [query.mutate]
  );

  return {
    ...query,
    put,
    putAll,
    remove,
    removeAll,
    update,
  };
};
