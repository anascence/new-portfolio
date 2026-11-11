import Image from "next/image";
import { MotionConfig } from "motion/react";
import { CodeGround } from "./ground/CodeGround";
import { Header } from "./ui/Header";
import { Hero } from "./ui/Hero";
import { Work } from "./ui/Work";
import { Journey } from "./ui/Journey";
import { Stack } from "./ui/Stack";
import { Contact } from "./ui/Contact";
import { Reveal } from "./ui/Reveal";
import { Code } from "./ui/Code";
import { person, shippingWith } from "./content";

function Feature({ id, title, children, text, aside }: { id: string; title: string; children: React.ReactNode; text: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section className="feature" id={id} aria-labelledby={`${id}-title`}>
      <div className="wrap">
        <hr className="rule" />
        <Reveal as="h2" className="feature__title"><span id={`${id}-title`}>{title}</span></Reveal>
      </div>
      {children}
      <div className="wrap feature__foot">
        <Reveal as="p" className="feature__text">{text}</Reveal>
        {aside && <Reveal delay={0.1}>{aside}</Reveal>}
      </div>
    </section>
  );
}

const aboutMe = [
  "const nay = {",
  "  role: \"Full-stack engineer\",",
  "  at: \"Issa Compass\",",
  "  stack: [\"Go\", \"TypeScript\", \"Next.js\", \"PostgreSQL\"],",
  "  editor: \"vim\",",
  "  os: \"arch\",",
  "  offline: [\"guitar\", \"日本語\", \"games\", \"the universe\"],",
  "};",
];

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <CodeGround />
      <Header />
      <main>
        <Hero />

        <section className="intro" id="intro">
          <div className="wrap">
            <Reveal className="logos">
              <p className="mono logos__label">Shipping with</p>
              <ul className="logos__row">
                {shippingWith.map((l) => (
                  <li key={l}><Image src={`/logos/${l}`} alt={l.replace(/(-white)?\.png$/, "")} width={36} height={36} /></li>
                ))}
              </ul>
            </Reveal>
            <Reveal as="h2" className="intro__title">Small tools.<br />Serious uptime.</Reveal>
            <Reveal as="p" className="intro__text" delay={0.1}>
              Most of what I build never gets a landing page: dashboards, chatbots, services the whole company quietly
              depends on. I care about making them fast, obvious and a little bit delightful.
            </Reveal>
          </div>
        </section>

        <Feature
          id="work"
          title="Selected work"
          text="Open-source projects from the Stamford Syntax Club and my own repos. Filter by stack, then open a card to read the code behind it."
          aside={<a className="mono-link arrow-link" href="https://github.com/anascence" target="_blank" rel="noopener noreferrer">All repositories ›</a>}
        >
          <Work />
        </Feature>

        <Feature
          id="journey"
          title="Experience"
          text="From class president to production on-call. Scroll or swipe through it."
          aside={<a className="mono-link arrow-link" href={person.resume} target="_blank" rel="noopener noreferrer">Full résumé ›</a>}
        >
          <Journey />
        </Feature>

        <Feature
          id="stack"
          title="Things I reach for"
          text="Drag them around. They always come back, like a good rollback."
          aside={<div className="panel"><Code lines={aboutMe} /></div>}
        >
          <Stack />
        </Feature>

        <Feature
          id="contact"
          title="Let’s build something"
          text="Internal tool, side project, or just a chat about Vim configs. My inbox is open."
        >
          <Contact />
        </Feature>
      </main>

      <footer className="footer">
        <div className="wrap footer__row">
          <span className="mono">© 2026 {person.name}</span>
          <span className="mono">The background is my own code</span>
        </div>
      </footer>
    </MotionConfig>
  );
}
