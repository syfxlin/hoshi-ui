import { useEffect, useRef } from "react";

const useDebounced = <T = any>(fn: (value: T) => void, wait: number) => {
  const mountedRef = useRef(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  const dispatch = (value: T) => {
    if (mountedRef.current) {
      cancel();
      timeoutRef.current = window.setTimeout(() => {
        fn(value);
      }, wait);
    }
  };

  const cancel = () => window.clearTimeout(timeoutRef.current);

  useEffect(() => {
    mountedRef.current = true;
    return cancel;
  }, []);

  return [dispatch, cancel] as const;
};

export default useDebounced;
