import { selector, useRecoilValueLoadable } from "recoil";
import { userMe } from "../api/ums";
import { AxiosError } from "axios";
import { token } from "./token";

export const auth = selector({
  key: "auth/state",
  get: async ({ get }) => {
    const t = get(token);
    if (t === null) {
      return null;
    }
    try {
      const response = await userMe();
      return response.data.data;
    } catch (e) {
      const error = e as AxiosError;
      if (error.response?.status === 401) {
        return null;
      } else {
        throw e;
      }
    }
  },
});

export const useAuth = () => useRecoilValueLoadable(auth);
