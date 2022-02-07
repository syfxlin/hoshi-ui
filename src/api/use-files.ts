import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import {
  deleteFile,
  FileView,
  listFiles,
  updateFile,
  UpdateFileView,
  uploadFile,
} from "./file";
import useSWRPage from "../utils/use-swr-page";
import { ApiPage } from "./request";
import useToast from "../utils/use-toast";

const useFiles = () => {
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<[string, "asc" | "desc"]>([
    "uploadedTime",
    "desc",
  ]);
  const [search, setSearch] = useState("");
  const [debounced] = useDebouncedValue(search, 1000);

  const query = useSWRPage<number, FileView>(
    ["files", page, sort, debounced],
    async (key, page: any, sort: any, search: any) => {
      const entity = await listFiles(
        {
          page,
          sort: {
            [sort[0]]: sort[1],
          },
        },
        search === "" ? undefined : search
      );
      const data = entity.data as ApiPage<FileView>;
      return {
        ...data,
        records: new Map(data.records.map((file) => [file.id, file])),
      };
    }
  );

  const $uploadFile = (file: File) =>
    uploadFile(file)
      .then(
        toast.api.success({
          title: "上传成功",
        })
      )
      .then((res) => {
        query.mutate();
        return res;
      })
      .catch(
        toast.api.error({
          title: "上传失败",
        })
      );

  const $updateFile = (file: UpdateFileView) =>
    updateFile(file)
      .then(
        toast.api.success({
          title: "修改成功",
        })
      )
      .then((res) => {
        const data = res.data as FileView;
        query.set(data.id, () => data);
        return res;
      })
      .catch(
        toast.api.error({
          title: "修改失败",
        })
      );

  const $deleteFile = (id: number) =>
    deleteFile(id)
      .then(
        toast.api.success({
          title: "删除成功",
        })
      )
      .then((res) => {
        query.mutate();
        return res;
      })
      .catch(
        toast.api.error({
          title: "删除失败",
        })
      );

  return {
    ...query,
    page,
    setPage,
    sort,
    setSort,
    search,
    setSearch,
    $uploadFile,
    $updateFile,
    $deleteFile,
  };
};

export default useFiles;
