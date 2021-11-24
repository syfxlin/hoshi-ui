import { useState } from "react";

const useLoading = (initial?: boolean) => {
  const [loading, setLoading] = useState<boolean>(!!initial);

  const start = () => setLoading(true);
  const stop = () => setLoading(false);
  const then = () => setLoading(false);
  const wrap = (p: Promise<any>) => {
    setLoading(true);
    return p.finally(() => setLoading(false));
  };

  return {
    loading,
    setLoading,
    start,
    stop,
    then,
    wrap,
  };
};

export default useLoading;
