import { ApiEntity, omit, request } from "./request";

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
  id: string;
  name?: string;
  description?: string;
  domain?: string;
  icon?: string;
  disclose?: boolean;
};

export type AddNoteView = {
  workspace: string;
  parent?: string;
  name: string;
  icon?: string;
};

export type UpdateNoteView = {
  id: string;
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

export const updateWorkspace = (workspace: UpdateWorkspaceView) =>
  request
    .put<ApiEntity<WorkspaceView>>(
      `/hoshi-note/workspaces/${workspace.id}`,
      omit(workspace, ["id"])
    )
    .then((response) => response.data);

export const deleteWorkspace = (id: string) =>
  request
    .delete<ApiEntity>(`/hoshi-note/workspaces/${id}`)
    .then((response) => response.data);

export const listNotes = (workspace: string, parent?: string) =>
  request
    .get<ApiEntity<ListNoteView[]>>(
      parent
        ? `/hoshi-note/notes/list/${workspace}/${parent}`
        : `/hoshi-note/notes/list/${workspace}`
    )
    .then((response) => response.data);

export const getNote = (id: string) =>
  request
    .get<ApiEntity<NoteView>>(`/hoshi-note/notes/${id}`)
    .then((response) => response.data);

export const addNote = (note: AddNoteView) =>
  request
    .post<ApiEntity<NoteView>>(
      `/hoshi-note/notes/${note.workspace}${
        note.parent ? `/${note.parent}` : ""
      }`,
      omit(note, ["workspace", "parent"])
    )
    .then((response) => response.data);

export const updateNote = (note: UpdateNoteView) =>
  request
    .put<ApiEntity<NoteView>>(
      `/hoshi-note/notes/${note.id}`,
      omit(note, ["id"])
    )
    .then((response) => response.data);

export const deleteNote = (id: string) =>
  request
    .delete<ApiEntity>(`/hoshi-note/notes/${id}`)
    .then((response) => response.data);

export const getBreadcrumb = (id: string) =>
  request
    .get<ApiEntity<BreadcrumbView>>(`/hoshi-note/notes/${id}/breadcrumb`)
    .then((response) => response.data);
