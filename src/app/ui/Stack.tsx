"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { tools } from "../content";

// A fanned hand of cards. Each one can be dragged and thrown; it springs back to the hand.
export function Stack() {
  const mid = (tools.length - 1) / 2;
  return (
    <div className="stage stage--stack">
      <div className="hand">
        {tools.map((t, i) => {
          const off = i - mid;
          return (
            <motion.div
              key={t.name}
              className="tool"
              style={{ zIndex: i, left: `calc(50% + ${off} * var(--spread))` }}
              initial={{ opacity: 0, y: 60, rotate: 0 }}
              whileInView={{ opacity: 1, y: Math.abs(off) * 10, rotate: off * 5 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ type: "spring", stiffness: 160, damping: 18, delay: i * 0.05 }}
              drag
              dragSnapToOrigin
              dragElastic={0.6}
              whileHover={{ y: -24, scale: 1.06, zIndex: 20 }}
              whileTap={{ scale: 1 }}
              whileDrag={{ scale: 1.15, zIndex: 30, rotate: 0 }}
            >
              <Image src={`/logos/${t.logo}`} alt="" width={44} height={44} draggable={false} />
              <span className="tool__name">{t.name}</span>
              <span className="tool__line">{t.line}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
