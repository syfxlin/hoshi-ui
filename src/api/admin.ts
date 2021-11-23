import { ApiEntity, ApiPage, pageable, Pageable, request } from "./request";
import { RoleView, UserView } from "./ums";

export type UpdateUserView = {
  username?: string;
  nickname?: string;
  email?: string;
  status?: boolean;
  password?: string;
};

export type AddUserView = {
  username: string;
  nickname: string;
  password: string;
  email: string;
  status: boolean;
};

export type AddRoleView = {
  name: string;
  description: string;
  status: boolean;
  permissions: string[];
};

export type UpdateRoleView = {
  description?: string;
  permissions?: string[];
  status?: boolean;
};

export const adminListUsers = (page: Pageable, search?: string) =>
  request
    .get<ApiEntity<ApiPage<UserView>>>(`/hoshi-ums/admin/users`, {
      params: {
        ...pageable(page),
        ...(search ? { search } : {}),
      },
    })
    .then((response) => response.data);

export const adminUpdateUser = (userId: number, user: UpdateUserView) =>
  request
    .put<ApiEntity<UserView>>(`/hoshi-ums/admin/users/${userId}`, user)
    .then((response) => response.data);

export const adminDeleteUser = (userId: number) =>
  request
    .delete<ApiEntity>(`/hoshi-ums/admin/users/${userId}`)
    .then((response) => response.data);

export const adminUpdateUserRole = (userId: number, roles: string[]) =>
  request
    .put<ApiEntity<UserView>>(`/hoshi-ums/admin/users/${userId}/role`, {
      roles,
    })
    .then((response) => response.data);

export const adminAddUser = (user: AddUserView) =>
  request
    .post<ApiEntity<UserView>>(`/hoshi-ums/admin/users`, user)
    .then((response) => response.data);

export const adminListRoles = () =>
  request
    .get<ApiEntity<RoleView[]>>(`/hoshi-ums/admin/roles`)
    .then((response) => response.data);

export const adminAddRole = (role: AddRoleView) =>
  request
    .post<ApiEntity<RoleView>>(`/hoshi-ums/admin/roles`, role)
    .then((response) => response.data);

export const adminUpdateRole = (roleName: string, role: UpdateRoleView) =>
  request
    .put<ApiEntity<RoleView>>(`/hoshi-ums/admin/roles/${roleName}`, role)
    .then((response) => response.data);

export const adminDeleteRole = (roleName: string) =>
  request
    .delete<ApiEntity>(`/hoshi-ums/admin/roles/${roleName}`)
    .then((response) => response.data);
