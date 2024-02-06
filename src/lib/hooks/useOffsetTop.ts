import React, { useEffect, useState } from "react";
import { useThrottle } from "./useThrottle";

export function useOffsetTop(ref?: React.RefObject<HTMLElement>) {
  const [viewportTop, setViewportTop] = useState<number | undefined>(undefined);
  const [pageOffsetTop, setPageOffsetTop] = useState<number | undefined>(undefined);

  const handler = useThrottle(() => {
    if (!ref?.current) return;

    const clientRect = ref.current.getBoundingClientRect();
    setViewportTop(clientRect.top);
    const newPageOffsetTop = clientRect.top + window.scrollY;
    setPageOffsetTop(newPageOffsetTop);
  }, 100); // execute at most once every 100ms

  useEffect(() => {
    if (!ref?.current) return;

    // execute once on mount
    handler();
    window.addEventListener("scroll", handler);

    // clean up
    return () => window.removeEventListener("scroll", handler);
  }, [ref, handler]);

  return { viewportTop, pageOffsetTop };
}
