import { useEffect, useState } from "react";
import { useInterval } from "@mantine/hooks";

const useCountDown = () => {
  const [timeout, setTimeout] = useState(0);
  const interval = useInterval(() => setTimeout((t) => t - 1), 1000);
  useEffect(() => {
    if (interval.active && timeout <= 0) {
      interval.stop();
    }
  }, [timeout]);
  return [
    timeout,
    (t: number) => {
      setTimeout(t);
      interval.start();
    },
  ] as const;
};

export default useCountDown;
