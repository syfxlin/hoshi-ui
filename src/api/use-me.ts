import useSWRValue from "../utils/use-swr-value";
import { userMe, UserView } from "./ums";
import { AxiosError } from "axios";
import { swr } from "../utils/swr-outside";

export const TOKEN_NAME = "hoshi-note$token";

export const token = {
  get: () => localStorage.getItem(TOKEN_NAME),
  set: (value?: string | null) => {
    if (value) {
      localStorage.setItem(TOKEN_NAME, value);
    } else {
      localStorage.removeItem(TOKEN_NAME);
    }
    // call swr refresh
    swr.mutate("me");
  },
};

const useMe = () => {
  const query = useSWRValue<UserView | undefined>("me", async () => {
    if (!token.get()) {
      return undefined;
    }
    try {
      const response = await userMe();
      return response.data.data;
    } catch (e) {
      const error = e as AxiosError;
      if (error.response?.status === 401) {
        return undefined;
      } else {
        throw e;
      }
    }
  });

  return {
    ...query,
  };
};

export default useMe;
