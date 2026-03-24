import { useMemo } from "react";

export function useScrollReveal() {
  return useMemo(
    () => ({
      hidden: { opacity: 0, y: 36 },
      visible: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: index * 0.08,
          duration: 0.75,
          ease: [0.22, 0.61, 0.36, 1]
        }
      })
    }),
    []
  );
}
