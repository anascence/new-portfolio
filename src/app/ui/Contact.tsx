"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { links, person } from "../content";
import { CopyEmail } from "./Hero";

// The yellow square leans toward the pointer anywhere on the stage, on a spring.
export function Contact() {
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18 });
  const y = useSpring(my, { stiffness: 220, damping: 18 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.18);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.18);
  };
  const reset = () => { mx.set(0); my.set(0); };

  return (
    <div className="stage stage--contact" onPointerMove={onMove} onPointerLeave={reset}>
      <motion.a
        href={`mailto:${person.email}?subject=${encodeURIComponent("Hello from your portfolio")}`}
        className="magnet"
        style={{ x, y }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        Say hello <span aria-hidden="true">›</span>
      </motion.a>
      <div className="contact__under">
        <CopyEmail />
        <ul className="contact__links">
          {links.map((l) => (
            <li key={l.label}>
              <a className="mono-link arrow-link" href={l.href} target="_blank" rel="noopener noreferrer">{l.label} ›</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
