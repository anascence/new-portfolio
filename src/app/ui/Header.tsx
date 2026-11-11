"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { person } from "../content";

const NAV = [
  { href: "#work", label: "Work" },
  { href: "#journey", label: "Experience" },
  { href: "#stack", label: "Stack" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <header className={`header${scrolled ? " is-scrolled" : ""}`}>
      <div className="wrap header__bar">
        <a href="#top" className="header__mark">
          <span className="header__glyph" aria-hidden="true" />
          {person.handle}
        </a>
        <nav aria-label="Sections" className="header__nav">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="mono-link">{n.label}</a>
          ))}
        </nav>
        <motion.a
          href={person.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="box-button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          Résumé
        </motion.a>
      </div>
    </header>
  );
}
