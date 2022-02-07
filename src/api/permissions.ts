import { SelectItem } from "@mantine/core";

export const permissions: SelectItem[] = [
  // User
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
    value: "TOKEN",
    label: "令牌管理",
    group: "User",
  },
  // File
  {
    value: "FILE",
    label: "文件管理",
    group: "File",
  },
  {
    value: "PEXELS",
    label: "Pexels 图库",
    group: "File",
  },
  // Note
  {
    value: "WORKSPACE",
    label: "工作区管理",
    group: "Note",
  },
  {
    value: "NOTE",
    label: "笔记管理",
    group: "Note",
  },
  // Admin
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
  // Ops
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
