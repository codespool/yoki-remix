import { useCallback, useRef } from "react";

// throttling received function
export function useThrottle<T>(
  fn: (args?: T) => void,
  durationMS: number, // スロットルする時間
) {
  const scrollingTimer = useRef<undefined | NodeJS.Timeout>();
  return useCallback(
    (args?: T) => {
      if (scrollingTimer.current) return; // If the timer is already set, nothing is done.
      scrollingTimer.current = setTimeout(() => {
        fn(args);
        scrollingTimer.current = undefined; // reset timer
      }, durationMS);
    },
    [fn, durationMS],
  );
}
