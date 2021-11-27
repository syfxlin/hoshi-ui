import { ApiEntity, request } from "./request";

export type PhotoView = {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
};
export const pexelsCurated = (params?: { page?: number; per_page?: number }) =>
  request
    .get<ApiEntity<PhotoView[]>>(`/hoshi-file/pexels/curated`, { params })
    .then((response) => response.data);

export const pexelsSearch = (params?: {
  page?: number;
  per_page?: number;
  query: string;
}) =>
  request
    .get<ApiEntity<PhotoView[]>>(`/hoshi-file/pexels/search`, { params })
    .then((response) => response.data);
