import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import {
  AddUserView,
  adminAddUser,
  adminDeleteUser,
  adminListUsers,
  adminUpdateUser,
  adminUpdateUserRole,
  UpdateUserView,
} from "./admin";
import useSWRPage from "../utils/use-swr-page";
import { ApiPage } from "./request";
import { UserView } from "./ums";
import useToast from "../utils/use-toast";

const useUsers = () => {
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<Record<string, "asc" | "desc">>({});
  const [search, setSearch] = useState("");
  const [debounced] = useDebouncedValue(search, 1000);

  const query = useSWRPage(
    ["admin/users", page, sort, debounced],
    async (key, page, sort, search) => {
      const entity = await adminListUsers(
        {
          page,
          sort,
        },
        search === "" ? undefined : search
      );
      const data = entity.data as ApiPage<UserView>;
      return {
        ...data,
        records: new Map(data.records.map((user) => [user.id, user])),
      };
    }
  );

  const $addUser = (user: AddUserView) =>
    adminAddUser(user)
      .then(
        toast.api.success({
          title: "新增成功",
        })
      )
      .then((res) => {
        query.mutate();
        return res;
      })
      .catch(
        toast.api.error({
          title: "新增失败",
        })
      );

  const $updateUser = (user: UpdateUserView) =>
    adminUpdateUser(user)
      .then(
        toast.api.success({
          title: "修改成功",
        })
      )
      .then((res) => {
        const data = res.data as UserView;
        query.set(data.id, () => data);
        return res;
      })
      .catch(
        toast.api.error({
          title: "修改失败",
        })
      );

  const $updateUserRole = (id: number, roles: string[]) =>
    adminUpdateUserRole(id, roles)
      .then(
        toast.api.success({
          title: "修改成功",
        })
      )
      .then((res) => {
        const data = res.data as UserView;
        query.set(data.id, () => data);
        return res;
      })
      .catch(
        toast.api.error({
          title: "修改失败",
        })
      );

  const $deleteUser = (id: number) =>
    adminDeleteUser(id)
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
    $addUser,
    $updateUser,
    $updateUserRole,
    $deleteUser,
  };
};

export default useUsers;
