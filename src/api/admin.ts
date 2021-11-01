import { ApiEntity, ApiPage, pageable, Pageable, request } from "./request";
import { Role, User } from "./ums";

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
    .delete<ApiEntity>(`/api/admin/users/${userId}`)
    .then((response) => response.data);

export const adminUpdateUserRole = (userId: string, roles: string[]) =>
  request
    .put(`/api/admin/users/${userId}/role`, { roles })
    .then((response) => response.data);

export const adminListRoles = () =>
  request
    .get<ApiEntity<Role[]>>(`/api/admin/roles`)
    .then((response) => response.data);

export type UpdateRole = Partial<Omit<Role, "name" | "createdTime">>;

export const adminUpdateRole = (roleName: string, role: UpdateRole) =>
  request
    .put<ApiEntity<Role>>(`/api/admin/roles/${roleName}`, role)
    .then((response) => response.data);

export const adminDeleteRole = (roleName: string) =>
  request
    .delete<ApiEntity>(`/api/admin/roles/${roleName}`)
    .then((response) => response.data);
