import useSWRValue from "../utils/use-swr-value";
import { getNote, NoteView, updateNote, UpdateNoteView } from "./note";
import useToast from "../utils/use-toast";
import { useWorkspaces } from "./use-workspace";
import { useEffect, useMemo } from "react";

const useNote = (id?: string) => {
  const toast = useToast();

  const query = useSWRValue<NoteView>(
    ["note", id],
    async (key, id) => {
      const item = localStorage.getItem(`doc:${id}`);
      if (item) {
        return JSON.parse(item).data as NoteView;
      }
      const entity = await getNote(id);
      return entity.data as NoteView;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
    }
  );

  // sync workspaces tree data
  const workspaces = useWorkspaces(false);
  useEffect(() => {
    const data = query.data;
    if (data) {
      workspaces.set(data.id, (prev) => ({
        ...prev,
        id: data.id,
        parent: data.parent ?? data.workspace,
        text: data.name,
        data,
      }));
    }
  }, [query.data]);

  // attributes
  const attributes = useMemo<
    Record<string, number | string | boolean | null>
  >(() => {
    const attrs = query.data?.attributes;
    if (!attrs) {
      return {};
    }
    return JSON.parse(attrs);
  }, [query.data]);

  const $updateNote = (note: Omit<UpdateNoteView, "id">) =>
    updateNote({
      ...note,
      id: query.data?.id as string,
    })
      .then((res) => {
        const data = res.data as NoteView;
        query.set((prev) => ({
          ...prev,
          ...data,
        }));
        workspaces.set(data.id, (prev) => ({
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
          title: "修改笔记失败",
        })
      );

  const $updateAttribute = (
    key: string,
    value: number | string | boolean | null
  ) =>
    $updateNote({
      attributes: JSON.stringify({
        ...attributes,
        [key]: value,
      }),
    });

  return {
    ...query,
    attributes,
    $updateNote,
    $updateAttribute,
  };
};

export default useNote;
