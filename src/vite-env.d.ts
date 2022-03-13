/// <reference types="vite/client" />

interface ImportMetaEnv {
  [key: string]: string | boolean | undefined;

  BASE_URL: string;
  MODE: string;
  DEV: boolean;
  PROD: boolean;
  SSR: boolean;
  // custom
  VITE_SERVER_URL: string;
  VITE_GRAFANA_URL: string;
  VITE_LONGHORN_URL: string;
  VITE_RABBITMQ_URL: string;
  VITE_MINIO_URL: string;
  VITE_CRDB_URL: string;
}

declare module "emoji-mart-virtualized" {
  export * from "emoji-mart";
}
