import { ApiEntity, ApiPage, pageable, Pageable, request } from "./request";

export type WorkspaceView = {
  id: string;
  user: number;
  name: string;
  description?: string | null;
  domain?: string | null;
  icon?: string | null;
  createdTime: string;
  disclose: boolean;
};

export enum NoteStatus {
  NORMAL = "NORMAL",
  LOCKED = "LOCKED",
  ARCHIVE = "ARCHIVE",
  DELETED = "DELETED",
}

export type NoteView = {
  id: string;
  parent?: string | null;
  workspace: string;
  name: string;
  content?: string | null;
  icon?: string | null;
  version: number;
  status: NoteStatus;
  attributes?: Record<string, any> | null;
  createdTime: string;
  updatedTime: string;
};

export type AddWorkspaceView = {
  name: string;
  description?: string;
  domain?: string;
  icon?: string;
  disclose: boolean;
};

export type UpdateWorkspaceView = {
  name?: string;
  description?: string;
  domain?: string;
  icon?: string;
  disclose?: boolean;
};

export type AddNoteView = {
  name: string;
  icon?: string | null;
};

export type UpdateNoteView = {
  parent?: string | "null";
  workspace?: string;
  name?: string;
  content?: string;
  icon?: string;
  status?: NoteStatus;
  attributes?: string;
};

export const listWorkspaces = (page: Pageable) =>
  request
    .get<ApiEntity<ApiPage<WorkspaceView>>>(`/hoshi-note/workspaces`, {
      params: {
        ...pageable(page),
      },
    })
    .then((response) => response.data);

export const addWorkspace = (workspace: AddWorkspaceView) =>
  request
    .post<ApiEntity<WorkspaceView>>(`/hoshi-note/workspaces`, workspace)
    .then((response) => response.data);

export const updateWorkspace = (id: string, workspace: UpdateWorkspaceView) =>
  request
    .put<ApiEntity<WorkspaceView>>(`/hoshi-note/workspaces/${id}`, workspace)
    .then((response) => response.data);

export const deleteWorkspace = (id: string) =>
  request
    .delete<ApiEntity>(`/hoshi-note/workspaces/${id}`)
    .then((response) => response.data);

export const listNotes = (workspaceId: string, parentId?: string) =>
  request
    .get<ApiEntity<ApiPage<NoteView>>>(
      parentId
        ? `/hoshi-note/notes/${workspaceId}/${parentId}`
        : `/hoshi-note/notes/${workspaceId}`
    )
    .then((response) => response.data);

export const addNote = (
  note: AddNoteView,
  workspaceId: string,
  parentId?: string
) =>
  request
    .post<ApiEntity<NoteView>>(
      `/hoshi-note/notes/${workspaceId}${parentId ? `/${parentId}` : ""}`,
      note
    )
    .then((response) => response.data);

export const updateNote = (id: string, note: UpdateNoteView) =>
  request
    .put<ApiEntity<NoteView>>(`/hoshi-note/notes/${id}`, note)
    .then((response) => response.data);

export const deleteNote = (id: string) =>
  request
    .delete<ApiEntity>(`/hoshi-note/notes/${id}`)
    .then((response) => response.data);
