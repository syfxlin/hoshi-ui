import {
  ApiEntity,
  ApiPage,
  omit,
  pageable,
  Pageable,
  request,
} from "./request";

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
  breadcrumb: BreadcrumbView;
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
  breadcrumb: BreadcrumbView;
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

export const treeNotes = (workspace: string, parent?: string) =>
  request
    .get<ApiEntity<ListNoteView[]>>(
      parent
        ? `/hoshi-note/notes/tree/${workspace}/${parent}`
        : `/hoshi-note/notes/tree/${workspace}`
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

export const listNotes = (id: string, page: Pageable, search?: string) =>
  request
    .get<ApiEntity<ApiPage<ListNoteView>>>(`/hoshi-note/notes/list/${id}`, {
      params: {
        ...pageable(page),
        ...(search ? { search } : {}),
      },
    })
    .then((response) => response.data);

export const getTrash = (page: Pageable, search?: string) =>
  request
    .get<ApiEntity<ApiPage<ListNoteView>>>(`/hoshi-note/notes/deleted`, {
      params: {
        ...pageable(page),
        ...(search ? { search } : {}),
      },
    })
    .then((response) => response.data);

export const getArchive = (page: Pageable, search?: string) =>
  request
    .get<ApiEntity<ApiPage<ListNoteView>>>(`/hoshi-note/notes/archived`, {
      params: {
        ...pageable(page),
        ...(search ? { search } : {}),
      },
    })
    .then((response) => response.data);

export const restoreNote = (id: string) =>
  request
    .put<ApiEntity>(`/hoshi-note/notes/${id}/restore`)
    .then((response) => response.data);

export const archiveNote = (id: string) =>
  request
    .delete<ApiEntity>(`/hoshi-note/notes/${id}/archive`)
    .then((response) => response.data);

export const forceDeleteNote = (id: string) =>
  request
    .delete<ApiEntity>(`/hoshi-note/notes/${id}/force`)
    .then((response) => response.data);

export type SearchNoteFiltersView = {
  onlyName?: boolean;
  workspace?: string;
  status?: string;
  createdTimeStart?: string;
  createdTimeEnd?: string;
  updatedTimeStart?: string;
  updatedTimeEnd?: string;
};

export const searchNote = (
  search: string,
  page: Pageable,
  filters?: SearchNoteFiltersView
) => {
  const _filters: string[] = [];
  if (filters?.onlyName) {
    _filters.push("onlyName");
  }
  if (filters?.workspace) {
    _filters.push(`workspace~${filters.workspace}`);
  }
  if (filters?.status) {
    _filters.push(`status~${filters.status}`);
  }
  if (filters?.createdTimeStart) {
    _filters.push(`createdTimeStart~${filters.createdTimeStart}`);
  }
  if (filters?.createdTimeEnd) {
    _filters.push(`createdTimeEnd~${filters.createdTimeEnd}`);
  }
  if (filters?.updatedTimeStart) {
    _filters.push(`updatedTimeStart~${filters.updatedTimeStart}`);
  }
  if (filters?.updatedTimeEnd) {
    _filters.push(`updatedTimeEnd~${filters.updatedTimeEnd}`);
  }
  return request
    .get<ApiEntity<ApiPage<ListNoteView>>>(`/hoshi-note/notes/search`, {
      params: {
        search,
        ...pageable(page),
        ...(_filters.length > 0 ? { filters: _filters } : {}),
      },
    })
    .then((response) => response.data);
};
