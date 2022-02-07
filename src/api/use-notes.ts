import { useMemo, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import useSWRPage from "../utils/use-swr-page";
import { AddNoteView, listNotes, ListNoteView } from "./note";
import { ApiPage } from "./request";
import { useWorkspaces } from "./use-workspaces";

const useNotes = (id?: string) => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<[string, "asc" | "desc"]>([
    "updatedTime",
    "desc",
  ]);
  const [search, setSearch] = useState("");
  const [debounced] = useDebouncedValue(search, 1000);

  const query = useSWRPage<string, ListNoteView>(
    ["list", id, page, sort, debounced],
    async (key, id: any, page: any, sort: any, search: any) => {
      const entity = await listNotes(
        id,
        {
          page,
          sort: {
            [sort[0]]: sort[1],
          },
        },
        search === "" ? undefined : search
      );
      const data = entity.data as ApiPage<ListNoteView>;
      return {
        ...data,
        records: new Map(data.records.map((item) => [item.id, item])),
      };
    }
  );

  const workspaces = useWorkspaces(false);
  const workspace = useMemo(
    () => workspaces.data?.get(id as string)?.data,
    [id, workspaces.data]
  );

  const $addNote = (note: Omit<AddNoteView, "workspace">) =>
    workspaces
      .$addNote({
        ...note,
        workspace: id as string,
      })
      .then((res) => {
        query.mutate();
        return res;
      });

  const $archiveNote = (id: string) =>
    workspaces.$archiveNote(id).then((res) => {
      query.mutate();
      return res;
    });

  const $deleteNote = (id: string) =>
    workspaces.$deleteNote(id).then((res) => {
      query.mutate();
      return res;
    });

  const $moveNote = (id: string, workspace: string, parent?: string) =>
    workspaces.$moveNote(id, workspace, parent);

  return {
    ...query,
    workspace,
    page,
    setPage,
    sort,
    setSort,
    search,
    setSearch,
    $addNote,
    $archiveNote,
    $deleteNote,
    $moveNote,
  };
};

export default useNotes;
