import { ApiEntity, ApiPage, pageable, Pageable, request } from "./request";

export type HFile = {
  id: number;
  disk: string;
  name: string;
  description?: string | null;
  size: number;
  contentType?: string | null;
  uploadedTime: string;
  url: string;
};

export const uploadFile = (file: File) => {
  const data = new FormData();
  data.append("file", file);
  return request
    .post<ApiEntity<HFile>>(`/hoshi-file/files`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data);
};

export const listFiles = (page: Pageable, search?: string) =>
  request
    .get<ApiEntity<ApiPage<HFile>>>(`/hoshi-file/files`, {
      params: {
        ...pageable(page),
        ...(search ? { search } : {}),
      },
    })
    .then((response) => response.data);

export const deleteFile = (disk: string) =>
  request
    .delete<ApiEntity>(`/hoshi-file/files/${disk}`)
    .then((response) => response.data);

export type UpdateFile = Partial<
  Omit<HFile, "id" | "disk" | "size" | "contentType" | "uploadedTime" | "url">
>;

export const updateFile = (fileId: HFile["id"], file: UpdateFile) =>
  request
    .put<ApiEntity<HFile>>(`/hoshi-file/files/${fileId}`, file)
    .then((response) => response.data);
