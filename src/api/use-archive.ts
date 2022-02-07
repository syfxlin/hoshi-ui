import { getArchive, ListNoteView } from "./note";
import useSWRPage from "../utils/use-swr-page";
import { ApiPage } from "./request";
import { useState } from "react";
import { useWorkspaces } from "./use-workspaces";
import { useDebouncedValue } from "@mantine/hooks";

const useArchive = () => {
  const workspaces = useWorkspaces(false);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<[string, "asc" | "desc"]>([
    "updatedTime",
    "desc",
  ]);
  const [search, setSearch] = useState("");
  const [debounced] = useDebouncedValue(search, 1000);

  const query = useSWRPage<string, ListNoteView>(
    ["archive", page, sort, debounced],
    async (key, page: any, sort: any, search: any) => {
      const entity = await getArchive(
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

  const $restoreNote = (id: string) =>
    workspaces.$restoreNote(id).then((res) => {
      query.mutate();
      return res;
    });

  const $deleteNote = (id: string) =>
    workspaces.$deleteNote(id).then((res) => {
      query.mutate();
      return res;
    });

  return {
    ...query,
    page,
    setPage,
    sort,
    setSort,
    search,
    setSearch,
    $restoreNote,
    $deleteNote,
  };
};

export default useArchive;
