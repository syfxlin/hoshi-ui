import { useMemo, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { ListNoteView, searchNote, WorkspaceView } from "./note";
import useSWRPage from "../utils/use-swr-page";
import { ApiPage } from "./request";
import { useWorkspaces } from "./use-workspaces";

const useSearch = () => {
  // page
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<[string, "asc" | "desc"]>(["name", "asc"]);
  // search
  const [search, setSearch] = useState("");
  const [debounced] = useDebouncedValue(search, 1000);
  // filters
  const [filters, setFilters] = useState({
    onlyName: false,
    workspace: "",
    status: "",
    createdTimeStart: "",
    createdTimeEnd: "",
    updatedTimeStart: "",
    updatedTimeEnd: "",
  });

  const query = useSWRPage<string, ListNoteView>(
    ["search", page, sort, debounced, filters],
    async (key, page: any, sort: any, search: any, filters: any) => {
      if (!search) {
        return {
          page: 1,
          size: 15,
          pages: 0,
          total: 0,
          records: new Map(),
        };
      }
      const entity = await searchNote(
        search,
        {
          page,
          sort: {
            [sort[0]]: sort[1],
          },
        },
        filters
      );
      const data = entity.data as ApiPage<ListNoteView>;
      return {
        ...data,
        records: new Map(data.records.map((note) => [note.id, note])),
      };
    }
  );

  const ws = useWorkspaces(false);
  const workspaces = useMemo(
    () =>
      ws.values
        .filter((w) => w.parent === 0)
        .map((w) => w.data) as WorkspaceView[],
    [ws.values]
  );

  return {
    ...query,
    page,
    setPage,
    sort,
    setSort,
    search,
    setSearch,
    filters,
    setFilters,
    workspaces,
  };
};

export default useSearch;
