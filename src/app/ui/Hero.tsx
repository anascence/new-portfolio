"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { person } from "../content";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { type: "spring" as const, stiffness: 120, damping: 20, delay },
});

// The email as a copyable command, the way motion.dev offers its install line.
export function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${person.email}`; // no clipboard access: open the mail client instead
    }
  };
  return (
    <div className="command">
      <a className="command__text" href={`mailto:${person.email}`}>{person.email}</a>
      <motion.button type="button" className="command__copy" onClick={copy} whileTap={{ scale: 0.9 }} aria-label="Copy email address">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? "done" : "copy"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {copied ? "Copied" : "Copy"}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero" id="top" data-hero>
      <div className="wrap hero__foot">
        <div className="hero__copy">
          <motion.h1 className="hero__title" {...rise(0.15)}>
            Full-stack engineer who makes internal tools feel like products.
          </motion.h1>
          <motion.p className="hero__lead" {...rise(0.3)}>
            {person.name}, a.k.a. {person.handle}. Shipping Go, TypeScript and Next.js at Issa Compass, mostly from inside Vim.
          </motion.p>
        </div>
        <motion.div className="hero__actions" {...rise(0.45)}>
          <p className="hero__note">Open to interesting problems.</p>
          <div className="hero__row">
            <CopyEmail />
            <motion.a href="#work" className="yellow-button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              View work <span aria-hidden="true">›</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
      <motion.a
        href="#intro"
        className="hero__more mono-link"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Learn more
        <motion.span aria-hidden="true" animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>⌄</motion.span>
      </motion.a>
    </section>
  );
}
