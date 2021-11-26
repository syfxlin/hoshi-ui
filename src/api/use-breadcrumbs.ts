import useSWR from "swr";
import { BreadcrumbView, getBreadcrumb } from "./note";

const useBreadcrumbs = (id?: string) => {
  return useSWR(["breadcrumbs", id], async (key, id) => {
    const entity = await getBreadcrumb(id);
    return entity.data as BreadcrumbView;
  });
};

export default useBreadcrumbs;
