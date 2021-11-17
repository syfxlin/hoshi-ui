export const join = (...paths: (string | number)[]) => {
  return paths
    .map((path) => `${path || ""}`.replace(/^\/|\/$/g, ""))
    .filter((path) => path)
    .join("/")
    .toLowerCase();
};

export const mod = (module: string, ...paths: (string | number)[]) => {
  return join(import.meta.env.VITE_SERVER_URL, module, ...paths);
};
