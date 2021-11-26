import useToast from "../utils/use-toast";
import { useState } from "react";
import { addFollowing, deleteFollowing, followByUserId, UserView } from "./ums";
import useSWRPage from "../utils/use-swr-page";
import { ApiPage } from "./request";

export const useFollow = (id: number, type: "followers" | "following") => {
  const toast = useToast();

  const [page, setPage] = useState(1);

  const query = useSWRPage<number, UserView>(
    ["follow", type, id, page],
    async (key, type, id, page) => {
      const entity = await followByUserId(type, id, page);
      const data = entity.data as ApiPage<UserView>;
      return {
        ...data,
        records: new Map(data.records.map((user) => [user.id, user])),
      };
    }
  );

  const $addFollow = (id: number) =>
    addFollowing(id)
      .then(
        toast.api.success({
          title: "关注成功",
        })
      )
      .then((res) => {
        query.mutate();
        return res;
      })
      .catch(
        toast.api.error({
          title: "关注失败",
        })
      );

  const $deleteFollow = (id: number) =>
    deleteFollowing(id)
      .then(
        toast.api.success({
          title: "取消关注成功",
        })
      )
      .then((res) => {
        query.mutate();
        return res;
      })
      .catch(
        toast.api.error({
          title: "取消关注失败",
        })
      );

  return {
    ...query,
    page,
    setPage,
    $addFollow,
    $deleteFollow,
  };
};

export default useFollow;
