import { useNotifications } from "@mantine/notifications";
import {
  NotificationProps,
  NotificationsContextProps,
} from "@mantine/notifications/lib/types";
import { AxiosError } from "axios";
import { ApiEntity } from "../api/request";

export type ToastProps = NotificationProps;

export type ToastResult = {
  id: string;
  close: () => void;
  update: (props: ToastProps) => void;
  notify: NotificationsContextProps;
};

const useToast = () => {
  const notify = useNotifications();

  const create = (props: ToastProps): ToastResult => {
    const id = notify.showNotification(props);
    return {
      id,
      close: () => notify.hideNotification(id),
      update: (p) => notify.updateNotification(id, p),
      notify,
    };
  };

  const close = (id: string) => {
    notify.hideNotification(id);
  };

  const update = (id: string, props: ToastProps) => {
    notify.updateNotification(id, props);
  };

  const api = {
    success:
      (props: Partial<ToastProps>) =>
      <T>(response: ApiEntity<T>) => {
        create({
          color: "green",
          autoClose: 3000,
          title: "操作成功",
          ...props,
          message: response.message ?? props.message ?? "操作成功",
        });
        return response;
      },
    error:
      (props: Partial<ToastProps>) =>
      <E>(err: AxiosError<ApiEntity<E>>) => {
        create({
          color: "red",
          autoClose: 3000,
          title: "操作失败",
          ...props,
          message: err.response?.data.message ?? props.message ?? "未知错误",
        });
        return Promise.reject(err);
      },
  };

  const def = {
    success: (props: ToastProps) =>
      create({
        color: "green",
        autoClose: 3000,
        title: "操作成功",
        ...props,
      }),
    error: (props: ToastProps) =>
      create({
        color: "red",
        autoClose: 3000,
        title: "操作失败",
        ...props,
      }),
  };

  return {
    create,
    close,
    update,
    clean: notify.clean,
    cleanQueue: notify.cleanQueue,
    api,
    def,
  };
};

export default useToast;
