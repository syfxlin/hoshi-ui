import { ApiEntity, ApiPage, pageable, Pageable, request } from "./request";
import { User } from "./ums";

export const adminListUsers = (page: Pageable, search?: string) =>
  request
    .get<ApiEntity<ApiPage<User>>>(`/api/admin/users`, {
      params: {
        ...pageable(page),
        ...(search ? { search } : {}),
      },
    })
    .then((response) => response.data);

export type UpdateUser = Partial<
  Omit<
    User,
    | "id"
    | "createdTime"
    | "roles"
    | "info"
    | "followersCount"
    | "followingCount"
  >
>;

export const adminUpdateUser = (userId: string, user: UpdateUser) =>
  request
    .put<ApiEntity<User>>(`/api/admin/users/${userId}`, user)
    .then((response) => response.data);

export const adminDeleteUser = (userId: string) =>
  request
    .delete<ApiEntity<User>>(`/api/admin/users/${userId}`)
    .then((response) => response.data);
