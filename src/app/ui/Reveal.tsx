"use client";

import { motion } from "motion/react";

// Rises into place once, when it scrolls into view.
export function Reveal({ children, className, delay = 0, as = "div" }: { children: React.ReactNode; className?: string; delay?: number; as?: "div" | "h2" | "p" }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ type: "spring", stiffness: 110, damping: 20, delay }}
    >
      {children}
    </Tag>
  );
}
