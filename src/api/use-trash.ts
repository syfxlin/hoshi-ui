import { forceDeleteNote, getTrash, ListNoteView, restoreNote } from "./note";
import useSWRPage from "../utils/use-swr-page";
import { ApiPage } from "./request";
import { useState } from "react";
import useToast from "../utils/use-toast";
import { useWorkspaces } from "./use-workspaces";
import { useModals } from "@mantine/modals";
import { useDebouncedValue } from "@mantine/hooks";

const useTrash = () => {
  const toast = useToast();
  const modals = useModals();

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
    async (key, page, sort, search) => {
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
    restoreNote(id)
      .then(
        toast.api.success({
          title: "恢复成功",
        })
      )
      .then((res) => {
        query.mutate();
        workspaces.mutate();
        return res;
      })
      .catch(
        toast.api.error({
          title: "恢复失败",
        })
      );

  const $forceDeleteNote = (id: string) =>
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
            query.mutate();
            return res;
          })
          .catch(
            toast.api.error({
              title: "永久删除失败",
            })
          );
      },
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
