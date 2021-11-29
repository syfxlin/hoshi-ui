import { ListNoteView, NoteView } from "./note";
import { useMemo } from "react";
import { getShare, getShareChildren } from "./share";
import useSWR from "swr";

const useShare = (id?: string) => {
  const query = useSWR<NoteView>(["share", id], async (key, id) => {
    const entity = await getShare(id);
    return entity.data as NoteView;
  });

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

  const children = useSWR<ListNoteView[]>(
    ["share/children", id],
    async (key, id) => {
      const entity = await getShareChildren(id);
      return entity.data as ListNoteView[];
    }
  );

  return {
    ...query,
    attributes,
    children,
  };
};

export default useShare;
