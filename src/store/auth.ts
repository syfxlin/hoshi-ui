import { atom, selector, useRecoilStateLoadable } from "recoil";
import { userMe } from "../api/ums";
import { AxiosError } from "axios";

export const authStore = atom({
  key: "auth",
  default: selector({
    key: "auth/default",
    get: async () => {
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
  }),
});

export const useAuth = () => useRecoilStateLoadable(authStore);
