import { ApiEntity, ApiPage, pageable, Pageable, request } from "./request";
import { ListNoteView, NoteView } from "./note";

export const listShares = (userId: number, page: Pageable, search?: string) =>
  request
    .get<ApiEntity<ApiPage<ListNoteView>>>(
      `/hoshi-note/shares/list/${userId}`,
      {
        params: {
          ...pageable(page),
          ...(search ? { search } : {}),
        },
      }
    )
    .then((response) => response.data);

export const getShare = (id: string) =>
  request
    .get<ApiEntity<NoteView>>(`/hoshi-note/shares/${id}`)
    .then((response) => response.data);

export const getShareChildren = (id: string) =>
  request
    .get<ApiEntity<ListNoteView[]>>(`/hoshi-note/shares/${id}/children`)
    .then((response) => response.data);
