import { ApiEntity, ApiPage, request } from "./request";
import { token } from "../store/token";
import { useAuth } from "../store/auth";
import { history } from "../store/history";

export type Role = {
  name: string;
  createdTime: string;
  status: boolean;
  permissions: string[];
  description?: string;
};

export type UserInfo = {
  id: User["id"];
  avatar?: string;
  bio?: string;
  address?: string;
  url?: string;
  company?: string;
  status?: string;
};

export type User = {
  id: string;
  username: string;
  password: string;
  nickname: string;
  email: string;
  status: boolean;
  createdTime: string;
  roles: Role[];
  info: UserInfo;
  followingCount: number;
  followersCount: number;
};

export type LoginView = {
  username: User["username"];
  password: User["password"];
  remember: boolean;
};

export type RegisterView = {
  code: string;
  username: User["username"];
  password: User["password"];
  nickname: User["nickname"];
  email: User["email"];
};

export type ResetPasswordView = {
  code: string;
  password: User["password"];
};

export const userMe = () => request.get<ApiEntity<User>>("/api/users");

export const login = async ({ username, password }: LoginView) => {
  const data = new URLSearchParams({
    username,
    password,
  });
  const response = await request.post<ApiEntity<User>>("/login", data);
  const t =
    response.headers["X-Auth-Token"] ?? response.headers["x-auth-token"];
  token.set(t);
  return response.data.data;
};

export const useLogin = () => {
  const [, setter] = useAuth();
  return async (data: LoginView) => {
    const user = await login(data);
    setter(user);
    history.push("/");
  };
};

export const logout = async () => {
  const response = await request.post("/logout");
  token.remove();
  return response.data;
};

export const useLogout = () => {
  const [, setter] = useAuth();
  return async () => {
    await logout();
    setter(null);
    history.push("/");
  };
};

export const sendRegisterCode = (email: User["email"]) =>
  request
    .post<ApiEntity>(`/register/${email}`)
    .then((response) => response.data);

export const register = (data: RegisterView) =>
  request
    .post<ApiEntity<User>>("/register", data)
    .then((response) => response.data);

export const sendResetPasswordCode = (email: User["email"]) =>
  request
    .post<ApiEntity>(`/reset-password/${email}`)
    .then((response) => response.data);

export const resetPassword = (data: ResetPasswordView) =>
  request
    .put<ApiEntity>(`/reset-password`, data)
    .then((response) => response.data);

export const userByUsername = (username: User["username"]) =>
  request
    .get<ApiEntity<User>>(`/api/users/${username}`)
    .then((response) => response.data);

export const followByUserId = (
  type: "followers" | "following",
  userId: User["id"],
  page: number
) =>
  request
    .get<ApiEntity<ApiPage<User>>>(
      `/api/follows/${userId}/${type}?page=${page - 1}`
    )
    .then((response) => response.data);

export const addFollowing = (userId: User["id"]) =>
  request
    .post<ApiEntity>(`/api/follows/${userId}`)
    .then((response) => response.data);

export const deleteFollowing = (userId: User["id"]) =>
  request
    .delete<ApiEntity>(`/api/follows/${userId}`)
    .then((response) => response.data);

export type UpdateName = {
  username?: User["username"];
  nickname?: User["nickname"];
};

export const updateName = (name: UpdateName) =>
  request
    .put<ApiEntity<User>>(`/api/users/name`, name)
    .then((response) => response.data);

export const sendUpdateEmailCode = (email: User["email"]) =>
  request
    .post<ApiEntity>(`/api/users/email/${email}`)
    .then((response) => response.data);

export type UpdateEmail = {
  code: string;
  email: User["email"];
};

export const updateEmail = (email: UpdateEmail) =>
  request
    .put<ApiEntity<User>>(`/api/users/email`, email)
    .then((response) => response.data);

export type UpdatePassword = {
  oldPassword: User["password"];
  newPassword: User["password"];
};

export const updatePassword = (password: UpdatePassword) =>
  request
    .put<ApiEntity<User>>(`/api/users/password`, password)
    .then((response) => response.data);

export type UpdateUserInfo = Partial<UserInfo>;

export const updateUserInfo = (info: UpdateUserInfo) =>
  request
    .put<ApiEntity<UserInfo>>(`/api/users/info`, info)
    .then((response) => response.data);

export type LoggedView = {
  sessionId: string;
  address: string;
  userAgent: string;
  creationTime: string;
  lastAccessedTime: string;
  current: boolean;
};

export const listLogged = () =>
  request
    .get<ApiEntity<LoggedView[]>>(`/api/users/logged`)
    .then((response) => response.data);

export const excludeLogged = (sessionId: LoggedView["sessionId"]) =>
  request
    .delete<ApiEntity>(`/api/users/exclude/${sessionId}`)
    .then((response) => response.data);
