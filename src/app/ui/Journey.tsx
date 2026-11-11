"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { journey } from "../content";

// Vertical scroll drives a horizontal track while the stage is pinned. Reduced motion (or a narrow
// screen) gets a plain swipeable row instead of the pinned run.
export function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const [distance, setDistance] = useState(0);
  const [pct, setPct] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const x = useTransform(smooth, (v) => -v * distance);
  useMotionValueEvent(smooth, "change", (v) => setPct(Math.round(Math.min(1, Math.max(0, v)) * 100)));

  useEffect(() => {
    const measure = () => {
      const t = trackRef.current;
      if (t) setDistance(window.innerWidth >= 900 ? Math.max(0, t.scrollWidth - t.clientWidth) : 0);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const pinned = !reduced && distance > 0;

  return (
    <div ref={ref} className={`stage stage--journey${pinned ? " is-pinned" : ""}`} style={pinned ? { height: `calc(100svh + ${distance}px)` } : undefined}>
      <div className="journey__sticky">
        <div className="wrap">
          <motion.ol ref={trackRef} className="journey__track" style={pinned ? { x } : undefined}>
            {journey.map((j) => (
              <li key={j.when} className="journey__item">
                <p className="mono">{j.when}</p>
                <h3 className="journey__role">{j.role}</h3>
                <p className="journey__org">{j.org}</p>
                <p className="journey__note">{j.note}</p>
              </li>
            ))}
          </motion.ol>
          <div className="progress" aria-hidden="true">
            <motion.div className="progress__bar" style={{ scaleX: pinned ? smooth : 1 }} />
          </div>
          <p className="mono progress__pct" aria-hidden="true">{pinned ? pct : 100}%</p>
        </div>
      </div>
    </div>
  );
}
