import useSWRValue from "../utils/use-swr-value";
import {
  updateEmail,
  UpdateEmailView,
  updateName,
  UpdateNameView,
  updatePassword,
  UpdatePasswordView,
  updateUserInfo,
  UpdateUserInfoView,
  UserInfoView,
  userMe,
  UserView,
} from "./ums";
import { AxiosError } from "axios";
import { swr } from "../utils/swr-outside";
import useToast from "../utils/use-toast";

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
  const toast = useToast();

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

  const $updateName = (name: UpdateNameView) =>
    updateName(name)
      .then(
        toast.api.success({
          title: "修改成功",
        })
      )
      .then((res) => {
        const data = res.data as UserView;
        query.set(() => data);
        return res;
      })
      .catch(
        toast.api.error({
          title: "修改失败",
        })
      );

  const $updateEmail = (email: UpdateEmailView) =>
    updateEmail(email)
      .then(
        toast.api.success({
          title: "修改成功",
        })
      )
      .then((res) => {
        const data = res.data as UserView;
        query.set(() => data);
        return res;
      })
      .catch(
        toast.api.error({
          title: "修改失败",
        })
      );

  const $updatePassword = (password: UpdatePasswordView) =>
    updatePassword(password)
      .then(
        toast.api.success({
          title: "修改成功",
        })
      )
      .then((res) => {
        const data = res.data as UserView;
        query.set(() => data);
        return res;
      })
      .catch(
        toast.api.error({
          title: "修改失败",
        })
      );

  const $updateUserInfo = (info: UpdateUserInfoView) =>
    updateUserInfo(info)
      .then(
        toast.api.success({
          title: "修改成功",
        })
      )
      .then((res) => {
        const data = res.data as UserInfoView;
        query.set(
          (prev) =>
            prev && {
              ...prev,
              info: data,
            }
        );
        return res;
      })
      .catch(
        toast.api.error({
          title: "修改失败",
        })
      );

  return {
    ...query,
    $updateName,
    $updateEmail,
    $updatePassword,
    $updateUserInfo,
  };
};

export default useMe;
