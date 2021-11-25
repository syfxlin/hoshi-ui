import { ApiEntity, request } from "./request";

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
  attributes?: string | null;
  createdTime: string;
  updatedTime: string;
};

export type ListNoteView = {
  id: string;
  parent?: string | null;
  workspace: string;
  name: string;
  icon?: string | null;
  status: NoteStatus;
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

export type BreadcrumbView = {
  workspace: {
    id: string;
    name: string;
  };
  parent: {
    id: string;
    name: string;
  }[];
  children: {
    id: string;
    name: string;
  }[];
};

export const listWorkspaces = () =>
  request
    .get<ApiEntity<WorkspaceView[]>>(`/hoshi-note/workspaces`)
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
    .get<ApiEntity<ListNoteView[]>>(
      parentId
        ? `/hoshi-note/notes/list/${workspaceId}/${parentId}`
        : `/hoshi-note/notes/list/${workspaceId}`
    )
    .then((response) => response.data);

export const getNote = (id: string) =>
  request
    .get<ApiEntity<NoteView>>(`/hoshi-note/notes/${id}`)
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

export const getBreadcrumb = (id: string) =>
  request
    .get<ApiEntity<BreadcrumbView>>(`/hoshi-note/notes/${id}/breadcrumb`)
    .then((response) => response.data);
