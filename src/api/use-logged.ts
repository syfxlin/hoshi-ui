import { excludeLogged, listLogged, LoggedView } from "./ums";
import useToast from "../utils/use-toast";
import useSWRMap from "../utils/use-swr-map";

const useLogged = () => {
  const toast = useToast();

  const query = useSWRMap<string, LoggedView>("logged", async () => {
    const entity = await listLogged();
    console.log(entity);
    return new Map(entity.data?.map((logged) => [logged.sessionId, logged]));
  });

  const $exclude = (id: string) =>
    excludeLogged(id)
      .then(
        toast.api.success({
          title: "删除成功",
        })
      )
      .then((res) => {
        query.remove(id);
        return res;
      })
      .catch(
        toast.api.error({
          title: "删除失败",
        })
      );

  return {
    ...query,
    $exclude,
  };
};

export default useLogged;
