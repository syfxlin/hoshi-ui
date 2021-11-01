import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { token } from "../store/token";
import { history } from "../store/history";
import qs from "qs";

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
  sort?: {
    property: string;
    direction?: "asc" | "desc";
  }[];
};

export const pageable = (page: Pageable) => {
  const params: Record<string, any> = {
    page: String(page.page - 1),
  };
  if (page.size !== undefined) {
    params.size = String(page.size);
  }
  if (page.sort !== undefined) {
    params.sort = page.sort.map((s) => `${s.property},${s.direction ?? "asc"}`);
  }
  return params;
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
    if (token.exist()) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers["Authorization"] = `Bearer ${token.get()}`;
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
      token.remove();
      history.push("/login");
    }
    return Promise.reject(error);
  }
);
