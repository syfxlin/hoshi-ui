import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { history } from "../store/history";
import qs from "qs";
import { recoil } from "../utils/recoil";
import { token } from "../store/token";
import { Incl } from "../utils/types";

export const request = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

export type ApiEntity<T = any> = {
  status: number;
  message: string;
  timestamp: string;
  data?: T;
  reason?: string | null;
};

export type ApiPage<T = any> = {
  page: number;
  size: number;
  pages: number;
  total: number;
  records: T[];
};

export type Pageable = {
  page: number;
  size?: number;
  sort?: Record<string, "asc" | "desc">;
};

export const pageable = (page: Pageable) => {
  const params: Record<string, any> = {
    page: String(page.page - 1),
  };
  if (page.size !== undefined) {
    params.size = String(page.size);
  }
  if (page.sort !== undefined) {
    params.sort = Object.entries(page.sort).map(
      ([prop, dir]) => `${prop},${dir ?? "asc"}`
    );
  }
  return params;
};

export const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  return Object.entries(obj)
    .filter(([key]) => !keys.includes(key as K))
    .reduce(
      (obj, [key, value]) => ({
        ...obj,
        [key]: value,
      }),
      {} as T
    );
};

export const incl = <T, K extends keyof T>(obj: T, keys: K[]): Incl<T, K> => {
  return Object.entries(obj)
    .filter(([key]) => keys.includes(key as K))
    .reduce(
      (obj, [key, value]) => ({
        ...obj,
        [key]: value,
      }),
      {} as T
    );
};

export const filter = <T>(
  obj: T,
  fn: <K extends keyof T>(key: T, value: T[K]) => boolean
) => {
  return Object.entries(obj)
    .filter(([key, value]) => fn(key as any, value))
    .reduce(
      (obj, [key, value]) => ({
        ...obj,
        [key]: value,
      }),
      {} as T
    );
};

export const createAxiosError = <T = any>(
  message: string,
  config: AxiosRequestConfig,
  code?: string,
  request?: any,
  response?: AxiosResponse<T>
): AxiosError<T> => {
  const error = new Error(message) as AxiosError<T>;
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  error.isAxiosError = true;
  error.toJSON = function toJSON(this: AxiosError) {
    return {
      // Standard
      message: this.message,
      name: this.name,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
    };
  };
  return error;
};

request.interceptors.request.use(
  (config) => {
    const t = recoil.get(token);
    if (t !== null) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers["Authorization"] = `Bearer ${t}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

request.interceptors.response.use(
  (response) => {
    const data = response.data as any;
    if (data?.status >= 400) {
      return Promise.reject(
        createAxiosError(
          data?.message,
          response.config,
          data?.status,
          response.request,
          response
        )
      );
    }
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      recoil.reset(token);
      history.push("/login");
    }
    return Promise.reject(error);
  }
);
