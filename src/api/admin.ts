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

export const adminUpdateUser = (userId: User["id"], user: UpdateUser) =>
  request
    .put<ApiEntity<User>>(`/api/admin/users/${userId}`, user)
    .then((response) => response.data);

export const adminDeleteUser = (userId: User["id"]) =>
  request
    .delete<ApiEntity>(`/api/admin/users/${userId}`)
    .then((response) => response.data);

export const adminUpdateUserRole = (userId: User["id"], roles: string[]) =>
  request
    .put<ApiEntity<User>>(`/api/admin/users/${userId}/role`, { roles })
    .then((response) => response.data);

export type AddUser = Omit<
  User,
  "id" | "createdTime" | "roles" | "info" | "followingCount" | "followersCount"
>;

export const adminAddUser = (user: AddUser) =>
  request
    .post<ApiEntity<User>>(`/api/admin/users`, user)
    .then((response) => response.data);

export const adminListRoles = () =>
  request
    .get<ApiEntity<Role[]>>(`/api/admin/roles`)
    .then((response) => response.data);

export type UpdateRole = Partial<Omit<Role, "name" | "createdTime">>;

export const adminUpdateRole = (roleName: Role["name"], role: UpdateRole) =>
  request
    .put<ApiEntity<Role>>(`/api/admin/roles/${roleName}`, role)
    .then((response) => response.data);

export const adminDeleteRole = (roleName: Role["name"]) =>
  request
    .delete<ApiEntity>(`/api/admin/roles/${roleName}`)
    .then((response) => response.data);
