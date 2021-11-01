import { useState } from "react";

const useLoading = (initial?: boolean) => {
  const [loading, setLoading] = useState<boolean>(!!initial);

  const start = () => setLoading(true);
  const stop = () => setLoading(false);
  const then = () => setLoading(false);

  return {
    loading,
    setLoading,
    start,
    stop,
    then,
  };
};

export default useLoading;
