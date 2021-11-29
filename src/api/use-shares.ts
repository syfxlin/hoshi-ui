import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import useSWRPage from "../utils/use-swr-page";
import { ListNoteView } from "./note";
import { ApiPage } from "./request";
import { listShares } from "./share";
import { useWorkspaces } from "./use-workspaces";

const useShares = (id?: number) => {
  const workspaces = useWorkspaces(false);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<[string, "asc" | "desc"]>([
    "updatedTime",
    "desc",
  ]);
  const [search, setSearch] = useState("");
  const [debounced] = useDebouncedValue(search, 1000);

  const query = useSWRPage<string, ListNoteView>(
    ["shares", id, page, sort, debounced],
    async (key, id, page, sort, search) => {
      const entity = await listShares(
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

  const $cancelShare = (id: string) =>
    workspaces.$shareNote(id).then((res) => {
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
    $cancelShare,
  };
};

export default useShares;
