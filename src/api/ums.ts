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
  id: string;
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

export type LoginData = {
  username: string;
  password: string;
  remember: boolean;
};

export type RegisterData = {
  code: string;
  username: string;
  password: string;
  nickname: string;
  email: string;
};

export type ResetPasswordData = {
  code: string;
  password: string;
};
export const userMe = () => request.get<ApiEntity<User>>("/api/users");

export const login = async ({ username, password }: LoginData) => {
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
  return async (data: LoginData) => {
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

export const sendRegisterCode = (email: string) =>
  request
    .post<ApiEntity>(`/register/${email}`)
    .then((response) => response.data);

export const register = (data: RegisterData) =>
  request
    .post<ApiEntity<User>>("/register", data)
    .then((response) => response.data);

export const sendResetPasswordCode = (email: string) =>
  request
    .post<ApiEntity>(`/reset-password/${email}`)
    .then((response) => response.data);

export const resetPassword = (data: ResetPasswordData) =>
  request
    .put<ApiEntity>(`/reset-password`, data)
    .then((response) => response.data);

export const userByUsername = (username: string) =>
  request
    .get<ApiEntity<User>>(`/api/users/${username}`)
    .then((response) => response.data);

export const followByUserId = (
  type: "followers" | "following",
  userId: string,
  page: number
) =>
  request
    .get<ApiEntity<ApiPage<User>>>(
      `/api/follows/${userId}/${type}?page=${page - 1}`
    )
    .then((response) => response.data);

export const addFollowing = (userId: string) =>
  request
    .post<ApiEntity>(`/api/follows/${userId}`)
    .then((response) => response.data);

export const deleteFollowing = (userId: string) =>
  request
    .delete<ApiEntity>(`/api/follows/${userId}`)
    .then((response) => response.data);
