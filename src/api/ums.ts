import { ApiEntity, ApiPage, request } from "./request";
import { token } from "../store/token";
import { history } from "../store/history";
import { recoil } from "../utils/recoil";

export type RoleView = {
  name: string;
  createdTime: string;
  status: boolean;
  permissions: string[];
  description?: string | null;
};

export type UserInfoView = {
  avatar?: string | null;
  bio?: string | null;
  address?: string | null;
  url?: string | null;
  company?: string | null;
  status?: string | null;
};

export type UserView = {
  id: number;
  username: string;
  nickname: string;
  email: string;
  status: boolean;
  createdTime: string;
  roles: RoleView[];
  info: UserInfoView;
  followingCount: number;
  followersCount: number;
};

export type LoginView = {
  username: string;
  password: string;
  remember: boolean;
};

export type RegisterView = {
  code: string;
  username: string;
  password: string;
  nickname: string;
  email: string;
};

export type ResetPasswordView = {
  code: string;
  password: string;
};

export type LoggedView = {
  sessionId: string;
  address: string;
  userAgent: string;
  creationTime: string;
  lastAccessedTime: string;
  current: boolean;
};

export type TokenView = {
  id: number;
  token: string;
  name: string;
};

export type UpdateNameView = {
  username?: string;
  nickname?: string;
};

export type UpdateEmailView = {
  code: string;
  email: string;
};

export type UpdatePasswordView = {
  oldPassword: string;
  newPassword: string;
};

export type UpdateUserInfoView = Partial<UserInfoView>;

export const userMe = () =>
  request.get<ApiEntity<UserView>>("/hoshi-ums/users");

export const login = async ({ username, password }: LoginView) => {
  const data = new URLSearchParams({
    username,
    password,
  });
  const response = await request.post<ApiEntity<UserView>>(
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

export const sendRegisterCode = (email: string) =>
  request
    .post<ApiEntity>(`/hoshi-ums/register/${email}`)
    .then((response) => response.data);

export const register = (data: RegisterView) =>
  request
    .post<ApiEntity>("/hoshi-ums/register", data)
    .then((response) => response.data);

export const sendResetPasswordCode = (email: string) =>
  request
    .post<ApiEntity>(`/hoshi-ums/reset-password/${email}`)
    .then((response) => response.data);

export const resetPassword = (data: ResetPasswordView) =>
  request
    .put<ApiEntity>(`/hoshi-ums/reset-password`, data)
    .then((response) => response.data);

export const userByUsername = (username: string) =>
  request
    .get<ApiEntity<UserView>>(`/hoshi-ums/users/${username}`)
    .then((response) => response.data);

export const followByUserId = (
  type: "followers" | "following",
  userId: number,
  page: number
) =>
  request
    .get<ApiEntity<ApiPage<UserView>>>(
      `/hoshi-ums/follows/${userId}/${type}?page=${page - 1}`
    )
    .then((response) => response.data);

export const addFollowing = (userId: number) =>
  request
    .post<ApiEntity>(`/hoshi-ums/follows/${userId}`)
    .then((response) => response.data);

export const deleteFollowing = (userId: number) =>
  request
    .delete<ApiEntity>(`/hoshi-ums/follows/${userId}`)
    .then((response) => response.data);

export const updateName = (name: UpdateNameView) =>
  request
    .put<ApiEntity<UserView>>(`/hoshi-ums/users/name`, name)
    .then((response) => response.data);

export const sendUpdateEmailCode = (email: string) =>
  request
    .post<ApiEntity>(`/hoshi-ums/users/email/${email}`)
    .then((response) => response.data);

export const updateEmail = (email: UpdateEmailView) =>
  request
    .put<ApiEntity<UserView>>(`/hoshi-ums/users/email`, email)
    .then((response) => response.data);

export const updatePassword = (password: UpdatePasswordView) =>
  request
    .put<ApiEntity<UserView>>(`/hoshi-ums/users/password`, password)
    .then((response) => response.data);

export const updateUserInfo = (info: UpdateUserInfoView) =>
  request
    .put<ApiEntity<UserInfoView>>(`/hoshi-ums/users/info`, info)
    .then((response) => response.data);

export const listLogged = () =>
  request
    .get<ApiEntity<LoggedView[]>>(`/hoshi-ums/users/logged`)
    .then((response) => response.data);

export const excludeLogged = (sessionId: string) =>
  request
    .delete<ApiEntity>(`/hoshi-ums/users/exclude/${sessionId}`)
    .then((response) => response.data);

export const listTokens = () =>
  request
    .get<ApiEntity<TokenView[]>>(`/hoshi-ums/tokens`)
    .then((response) => response.data);

export const revokeToken = (token: TokenView["token"]) =>
  request
    .delete<ApiEntity>(`/hoshi-ums/tokens/${token}`)
    .then((response) => response.data);

export const addToken = (name: string) =>
  request
    .post<ApiEntity<TokenView>>(`/hoshi-ums/tokens/${name}`)
    .then((response) => response.data);
