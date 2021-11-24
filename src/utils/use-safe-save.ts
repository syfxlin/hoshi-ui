import { useCallback, useEffect, useRef } from "react";
import { useTimeoutFn, useUnmount } from "react-use";

const useSafeSave = <T = any>(
  data: T,
  key: (data: T) => string,
  save: (data: T) => Promise<void>
) => {
  // 编辑时 3s 保存本地，30s 保存服务器
  // 离线时立即保存到本地，恢复时立即上传
  // 切换到其他 tab 或文档立即保存本地，当切回时立即保存
  const enable = useRef(false);

  const [, cancel3s, reset3s] = useTimeoutFn(() => {
    if (enable.current) {
      localStorage.setItem(key(data), JSON.stringify(data));
    }
  }, 3000);

  const [, cancel30s, reset30s] = useTimeoutFn(() => {
    if (enable.current) {
      save(data).then(() => {
        localStorage.removeItem(key(data));
      });
    }
  }, 30000);

  const _save = useCallback(() => {
    localStorage.setItem(key(data), JSON.stringify(data));
    return save(data).then(() => {
      localStorage.removeItem(key(data));
    });
  }, [key, save]);

  const cancel = useCallback(() => {
    cancel3s();
    cancel30s();
  }, [cancel3s, cancel30s]);

  // save on update
  useEffect(() => {
    reset3s();
    reset30s();
  }, [data]);

  // save on offline, hidden
  useEffect(() => {
    if (!enable.current) {
      return;
    }
    const saveToLocal = () => {
      localStorage.setItem(key(data), JSON.stringify(data));
    };
    const saveToCloud = () => {
      save(data).then(() => {
        localStorage.removeItem(key(data));
      });
    };
    const visibilityChange = () => {
      if (document.visibilityState === "hidden") {
        saveToLocal();
      } else if (document.visibilityState === "visible") {
        saveToCloud();
      }
    };

    window.addEventListener("offline", saveToLocal);
    window.addEventListener("online", saveToCloud);
    window.addEventListener("visibilitychange", visibilityChange);

    return () => {
      window.removeEventListener("offline", saveToLocal);
      window.removeEventListener("online", saveToCloud);
      window.removeEventListener("visibilitychange", visibilityChange);
    };
  }, [data, enable, key, save]);

  // save on unmount
  useUnmount(() => {
    if (enable.current) {
      enable.current = false;
      _save();
      cancel();
    }
  });

  return [enable, _save, cancel] as const;
};

export default useSafeSave;
