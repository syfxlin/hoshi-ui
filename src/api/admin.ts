import { ApiEntity, ApiPage, pageable, Pageable, request } from "./request";
import { Role, User } from "./ums";

export const adminListUsers = (page: Pageable, search?: string) =>
  request
    .get<ApiEntity<ApiPage<User>>>(`/hoshi-ums/admin/users`, {
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
    .put<ApiEntity<User>>(`/hoshi-ums/admin/users/${userId}`, user)
    .then((response) => response.data);

export const adminDeleteUser = (userId: User["id"]) =>
  request
    .delete<ApiEntity>(`/hoshi-ums/admin/users/${userId}`)
    .then((response) => response.data);

export const adminUpdateUserRole = (userId: User["id"], roles: string[]) =>
  request
    .put<ApiEntity<User>>(`/hoshi-ums/admin/users/${userId}/role`, { roles })
    .then((response) => response.data);

export type AddUser = Omit<
  User,
  "id" | "createdTime" | "roles" | "info" | "followingCount" | "followersCount"
>;

export const adminAddUser = (user: AddUser) =>
  request
    .post<ApiEntity<User>>(`/hoshi-ums/admin/users`, user)
    .then((response) => response.data);

export const adminListRoles = () =>
  request
    .get<ApiEntity<Role[]>>(`/hoshi-ums/admin/roles`)
    .then((response) => response.data);

export type AddRole = Omit<Role, "createdTime">;

export const adminAddRole = (role: AddRole) =>
  request
    .post<ApiEntity<Role>>(`/hoshi-ums/admin/roles`, role)
    .then((response) => response.data);

export type UpdateRole = Partial<Omit<Role, "name" | "createdTime">>;

export const adminUpdateRole = (roleName: Role["name"], role: UpdateRole) =>
  request
    .put<ApiEntity<Role>>(`/hoshi-ums/admin/roles/${roleName}`, role)
    .then((response) => response.data);

export const adminDeleteRole = (roleName: Role["name"]) =>
  request
    .delete<ApiEntity>(`/hoshi-ums/admin/roles/${roleName}`)
    .then((response) => response.data);
