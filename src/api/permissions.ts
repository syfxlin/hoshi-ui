import { SelectItem } from "@mantine/core/lib/src/components/Select/types";

export const permissions: SelectItem[] = [
  {
    value: "ME",
    label: "个人信息管理",
    group: "User",
  },
  {
    value: "ME_LOGGED_MANAGER",
    label: "已登录设备管理",
    group: "User",
  },
  {
    value: "FOLLOW_USER",
    label: "关注",
    group: "User",
  },
  {
    value: "USER_MANAGER",
    label: "用户管理",
    group: "Admin",
  },
  {
    value: "ROLE_MANAGER",
    label: "角色管理",
    group: "Admin",
  },
  {
    value: "BOOT_ADMIN",
    label: "监控",
    group: "Ops",
  },
  {
    value: "ACTUATOR",
    label: "监控",
    group: "Ops",
  },
];
