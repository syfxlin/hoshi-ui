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
