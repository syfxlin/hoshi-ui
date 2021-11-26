import useSWR from "swr";
import { userByUsername, UserView } from "./ums";

const useUser = (username: string) => {
  return useSWR<UserView>(["user", username], async (key, username) => {
    const entity = await userByUsername(username);
    return entity.data as UserView;
  });
};

export default useUser;
