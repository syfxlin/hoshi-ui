import {
  ApiEntity,
  ApiPage,
  omit,
  pageable,
  Pageable,
  request,
} from "./request";

export type FileView = {
  id: number;
  disk: string;
  name: string;
  description?: string | null;
  size: number;
  contentType?: string | null;
  uploadedTime: string;
  url: string;
};

export type UpdateFileView = {
  id: number;
  name?: string;
  description?: string | null;
};

export const uploadFile = (file: File) => {
  const data = new FormData();
  data.append("file", file);
  return request
    .post<ApiEntity<FileView>>(`/hoshi-file/files`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data);
};

export const listFiles = (page: Pageable, search?: string) =>
  request
    .get<ApiEntity<ApiPage<FileView>>>(`/hoshi-file/files`, {
      params: {
        ...pageable(page),
        ...(search ? { search } : {}),
      },
    })
    .then((response) => response.data);

export const deleteFile = (id: number) =>
  request
    .delete<ApiEntity>(`/hoshi-file/files/${id}`)
    .then((response) => response.data);

export const updateFile = (file: UpdateFileView) =>
  request
    .put<ApiEntity<FileView>>(
      `/hoshi-file/files/${file.id}`,
      omit(file, ["id"])
    )
    .then((response) => response.data);
