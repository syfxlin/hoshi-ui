import { addToken, listTokens, revokeToken, TokenView } from "./ums";
import useSWRMap from "../utils/use-swr-map";
import useToast from "../utils/use-toast";

const useTokens = () => {
  const toast = useToast();

  const query = useSWRMap<string, TokenView>("tokens", async () => {
    const entity = await listTokens();
    return new Map(entity.data?.map((token) => [token.token, token]));
  });

  const $addToken = (name: string) =>
    addToken(name)
      .then(
        toast.api.success({
          title: "新增成功",
        })
      )
      .then((res) => {
        const data = res.data as TokenView;
        query.add(data.token, data);
        return res;
      })
      .catch(
        toast.api.error({
          title: "新增失败",
        })
      );

  const $revokeToken = (token: string) =>
    revokeToken(token)
      .then(
        toast.api.success({
          title: "撤销成功",
        })
      )
      .then((res) => {
        query.remove(token);
        return res;
      })
      .catch(
        toast.api.error({
          title: "撤销失败",
        })
      );

  return {
    ...query,
    $addToken,
    $revokeToken,
  };
};

export default useTokens;
