import useSWR from "swr";
import { BreadcrumbView, getBreadcrumb } from "./note";

const useBreadcrumbs = (id?: string) => {
  return useSWR<BreadcrumbView>(
    ["breadcrumbs", id],
    async (key, id) => {
      const entity = await getBreadcrumb(id);
      return entity.data as BreadcrumbView;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
    }
  );
};

export default useBreadcrumbs;
