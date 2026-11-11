"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { filters, projects, type Project } from "../content";
import { Code } from "./Code";

const spring = { type: "spring" as const, stiffness: 380, damping: 34 };

function Card({ p, onOpen }: { p: Project; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      layout
      layoutId={`card-${p.name}`}
      className="card"
      onClick={onOpen}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={spring}
      aria-label={`${p.name}, ${p.kind}, ${p.year}. Open details`}
    >
      <div className="card__code" aria-hidden="true">
        <Code lines={p.excerpt.lines} numbered={false} />
      </div>
      <motion.div layout="position" className="card__meta">
        <span className="mono">{p.year} · {p.kind}</span>
        <span className="card__name">{p.name}</span>
      </motion.div>
    </motion.button>
  );
}

function Detail({ p, onClose }: { p: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      opener?.focus(); // return focus to the card that opened it
    };
  }, [onClose]);

  return (
    <>
      <motion.div className="scrim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <div className="detail__frame">
        <motion.div layoutId={`card-${p.name}`} className="detail" role="dialog" aria-modal="true" aria-label={p.name} transition={spring}>
          <div className="detail__head">
            <div>
              <p className="mono">{p.year} · {p.kind}</p>
              <h3 className="detail__name">{p.name}</h3>
            </div>
            <button ref={closeRef} type="button" className="detail__close mono-link" onClick={onClose}>Close ✕</button>
          </div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
            <p className="detail__blurb">{p.blurb}</p>
            <ul className="chips">
              {p.stack.map((s) => <li key={s} className="chip">{s}</li>)}
            </ul>
            <div className="panel">
              <p className="panel__file mono">{p.excerpt.file}</p>
              <Code lines={p.excerpt.lines} start={p.excerpt.start} />
            </div>
            <a className="mono-link arrow-link" href={p.href} target="_blank" rel="noopener noreferrer">View on GitHub ›</a>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export function Work() {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<Project | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const shown = filter === "All" ? projects : projects.filter((p) => p.stack.includes(filter));

  return (
    <LayoutGroup>
      <div className="stage stage--work">
        <div className="wrap">
          <motion.div layout className="grid">
            <AnimatePresence mode="popLayout">
              {shown.map((p) => <Card key={p.name} p={p} onOpen={() => setOpen(p)} />)}
            </AnimatePresence>
          </motion.div>
          <div className="tabs" role="group" aria-label="Filter projects by technology">
            {filters.map((f) => (
              <button key={f} type="button" className="tab" aria-pressed={f === filter} onClick={() => setFilter(f)}>
                {f === filter && <motion.span layoutId="tab-pill" className="tab__pill" transition={spring} />}
                <span className="tab__label">{f}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Portalled to <body> so the dialog sits above the fixed header, outside main's stacking context. */}
      {mounted &&
        createPortal(<AnimatePresence>{open && <Detail key={open.name} p={open} onClose={close} />}</AnimatePresence>, document.body)}
    </LayoutGroup>
  );
}
