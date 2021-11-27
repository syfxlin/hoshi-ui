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
  PEXELS_TOKEN: string;
}

declare module "emoji-mart-virtualized" {
  export * from "emoji-mart";
}
