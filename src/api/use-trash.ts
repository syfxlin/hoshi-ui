import { getTrash, ListNoteView } from "./note";
import useSWRPage from "../utils/use-swr-page";
import { ApiPage } from "./request";
import { useState } from "react";
import { useWorkspaces } from "./use-workspaces";
import { useDebouncedValue } from "@mantine/hooks";

const useTrash = () => {
  const workspaces = useWorkspaces(false);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<[string, "asc" | "desc"]>([
    "updatedTime",
    "desc",
  ]);
  const [search, setSearch] = useState("");
  const [debounced] = useDebouncedValue(search, 1000);

  const query = useSWRPage<string, ListNoteView>(
    ["trash", page, sort, debounced],
    async (key, page: any, sort: any, search: any) => {
      const entity = await getTrash(
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

  const $forceDeleteNote = (id: string) =>
    workspaces.$forceDeleteNote(id).then((res) => {
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
    $forceDeleteNote,
  };
};

export default useTrash;
