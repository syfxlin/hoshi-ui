import { ApiEntity, ApiPage, request } from "./request";
import { token } from "../store/token";
import { history } from "../store/history";
import { recoil } from "../utils/recoil";

export type Role = {
  name: string;
  createdTime: string;
  status: boolean;
  permissions: string[];
  description?: string | null;
};

export type UserInfo = {
  id: User["id"];
  avatar?: string | null;
  bio?: string | null;
  address?: string | null;
  url?: string | null;
  company?: string | null;
  status?: string | null;
};

export type User = {
  id: number;
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

export const userMe = () => request.get<ApiEntity<User>>("/hoshi-ums/users");

export const login = async ({ username, password }: LoginView) => {
  const data = new URLSearchParams({
    username,
    password,
  });
  const response = await request.post<ApiEntity<User>>(
    "/hoshi-ums/login",
    data
  );
  const t =
    response.headers["X-Auth-Token"] ?? response.headers["x-auth-token"];
  recoil.set(token, t);
  history.push("/");
  return response.data.data;
};

export const logout = async () => {
  const response = await request.post("/hoshi-ums/logout");
  recoil.reset(token);
  history.push("/");
  return response.data;
};

export const sendRegisterCode = (email: User["email"]) =>
  request
    .post<ApiEntity>(`/hoshi-ums/register/${email}`)
    .then((response) => response.data);

export const register = (data: RegisterView) =>
  request
    .post<ApiEntity<User>>("/hoshi-ums/register", data)
    .then((response) => response.data);

export const sendResetPasswordCode = (email: User["email"]) =>
  request
    .post<ApiEntity>(`/hoshi-ums/reset-password/${email}`)
    .then((response) => response.data);

export const resetPassword = (data: ResetPasswordView) =>
  request
    .put<ApiEntity>(`/hoshi-ums/reset-password`, data)
    .then((response) => response.data);

export const userByUsername = (username: User["username"]) =>
  request
    .get<ApiEntity<User>>(`/hoshi-ums/users/${username}`)
    .then((response) => response.data);

export const followByUserId = (
  type: "followers" | "following",
  userId: User["id"],
  page: number
) =>
  request
    .get<ApiEntity<ApiPage<User>>>(
      `/hoshi-ums/follows/${userId}/${type}?page=${page - 1}`
    )
    .then((response) => response.data);

export const addFollowing = (userId: User["id"]) =>
  request
    .post<ApiEntity>(`/hoshi-ums/follows/${userId}`)
    .then((response) => response.data);

export const deleteFollowing = (userId: User["id"]) =>
  request
    .delete<ApiEntity>(`/hoshi-ums/follows/${userId}`)
    .then((response) => response.data);

export type UpdateName = {
  username?: User["username"];
  nickname?: User["nickname"];
};

export const updateName = (name: UpdateName) =>
  request
    .put<ApiEntity<User>>(`/hoshi-ums/users/name`, name)
    .then((response) => response.data);

export const sendUpdateEmailCode = (email: User["email"]) =>
  request
    .post<ApiEntity>(`/hoshi-ums/users/email/${email}`)
    .then((response) => response.data);

export type UpdateEmail = {
  code: string;
  email: User["email"];
};

export const updateEmail = (email: UpdateEmail) =>
  request
    .put<ApiEntity<User>>(`/hoshi-ums/users/email`, email)
    .then((response) => response.data);

export type UpdatePassword = {
  oldPassword: User["password"];
  newPassword: User["password"];
};

export const updatePassword = (password: UpdatePassword) =>
  request
    .put<ApiEntity<User>>(`/hoshi-ums/users/password`, password)
    .then((response) => response.data);

export type UpdateUserInfo = Partial<UserInfo>;

export const updateUserInfo = (info: UpdateUserInfo) =>
  request
    .put<ApiEntity<UserInfo>>(`/hoshi-ums/users/info`, info)
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
    .get<ApiEntity<LoggedView[]>>(`/hoshi-ums/users/logged`)
    .then((response) => response.data);

export const excludeLogged = (sessionId: LoggedView["sessionId"]) =>
  request
    .delete<ApiEntity>(`/hoshi-ums/users/exclude/${sessionId}`)
    .then((response) => response.data);

export type Token = {
  id: number;
  token: string;
  name: string;
};

export const listTokens = () =>
  request
    .get<ApiEntity<Token[]>>(`/hoshi-ums/tokens`)
    .then((response) => response.data);

export const revokeToken = (token: Token["token"]) =>
  request
    .delete<ApiEntity>(`/hoshi-ums/tokens/${token}`)
    .then((response) => response.data);

export const addToken = (name: string) =>
  request
    .post<ApiEntity<Token>>(`/hoshi-ums/tokens/${name}`)
    .then((response) => response.data);
