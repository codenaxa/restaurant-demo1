"use client";

import type { PropsWithChildren } from "react";
import { motion } from "framer-motion";

export function PageTransition({ children }: PropsWithChildren) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
