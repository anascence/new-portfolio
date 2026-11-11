"use client";

import { useEffect, useRef, useState } from "react";
import { groundCode } from "./code";

// The page's ground: Nay's own code, collapsed into one stream, drifting upward while the hero is on screen.
// In the hero, the avatar resolves out of the same characters in the accent colour.

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"; // taste-skill-ignore: the ground is literal source code
const GROUND = { font: 13, line: 20 };
const FIGURE = { font: 9, line: 11 };
const SPEED_PX_PER_S = 9;
const FPS = 30;
const SCRAMBLE = "{}[]()<>=+-*/%&|!?:;$#@~^0123456789";
const LIGHT = ".:-";
const MID = "=+*";

type Cell = { x: number; y: number; level: number; base: string };
type Figure = { layer: HTMLCanvasElement; cells: Cell[]; size: number; cw: number };

function readTokens() {
  const css = getComputedStyle(document.documentElement);
  return {
    bg: css.getPropertyValue("--bg").trim() || "#1c1c1c",
    ink: css.getPropertyValue("--ground-ink").trim() || "rgba(241,241,239,0.085)",
    accent: css.getPropertyValue("--figure").trim() || "#f2b33d",
  };
}

// Build the figure once into its own layer: dark pixels (hair, glasses, outline, jacket) become code,
// mid tones become shading glyphs, light areas fade out. The ground is knocked out under the silhouette.
function buildFigure(img: HTMLImageElement, size: number, stream: string, t: ReturnType<typeof readTokens>, dpr: number): Figure {
  const probe = document.createElement("canvas").getContext("2d")!;
  probe.font = `${FIGURE.font}px ${MONO}`;
  const cw = probe.measureText("M").width;
  const cols = Math.floor(size / cw);
  const rows = Math.floor(size / FIGURE.line);

  const sample = document.createElement("canvas");
  sample.width = cols;
  sample.height = rows;
  const sctx = sample.getContext("2d", { willReadFrequently: true })!;
  sctx.drawImage(img, 0, 0, cols, rows);
  const { data } = sctx.getImageData(0, 0, cols, rows);

  const layer = document.createElement("canvas");
  layer.width = Math.round(size * dpr);
  layer.height = Math.round(size * dpr);
  const ctx = layer.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.font = `${FIGURE.font}px ${MONO}`;
  ctx.textBaseline = "top";

  const cells: Cell[] = [];
  let s = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const i = (row * cols + col) * 4;
      if (data[i + 3] < 128) continue;
      const dark = 1 - (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
      let level: number, base: string;
      if (dark > 0.62) { level = 1; base = stream[s++ % stream.length]; if (base === " ") base = stream[s++ % stream.length]; }
      else if (dark > 0.4) { level = 0.62; base = MID[(row + col) % MID.length]; }
      else if (dark > 0.18) { level = 0.34; base = LIGHT[(row * 3 + col) % LIGHT.length]; }
      else { level = 0.12; base = "."; }
      const cell = { x: col * cw, y: row * FIGURE.line, level, base };
      cells.push(cell);
      ctx.fillStyle = t.bg;
      ctx.fillRect(cell.x, cell.y, cw + 0.5, FIGURE.line + 0.5);
      ctx.globalAlpha = level;
      ctx.fillStyle = t.accent;
      ctx.fillText(base, cell.x, cell.y + 1);
      ctx.globalAlpha = 1;
    }
  }
  return { layer, cells, size, cw };
}

export function CodeGround() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("ground-paused") === "1") setPaused(true);
    } catch {
      /* storage unavailable: start in motion */
    }
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    pausedRef.current = paused || reduced;
  }, [paused, reduced]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const tokens = readTokens();
    const stream = groundCode;
    const groundFont = `${GROUND.font}px ${MONO}`;
    let width = 0, height = 0, cols = 0, dpr = 1;
    let offset = 0;
    let figure: Figure | null = null;
    let avatarImg: HTMLImageElement | null = null;
    const scrambled = new Map<number, number>(); // cell index -> ticks left
    let raf = 0, last = 0, drawnKey = "";

    const heroHeight = () => document.querySelector<HTMLElement>("[data-hero]")?.offsetHeight ?? height;

    // The figure is the hero's centrepiece; the copy sits under it at the foot of the screen.
    const figureBox = () => {
      const h = heroHeight();
      const wide = width >= 900;
      const size = wide ? Math.min(h * 0.64, width * 0.42) : Math.min(width * 0.88, h * 0.46);
      const x = (width - size) / 2;
      const y = (wide ? h * 0.05 : h * 0.12) - window.scrollY;
      return { x, y, size };
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = groundFont;
      cols = Math.ceil(width / ctx.measureText("M").width) + 1;
      if (avatarImg) figure = buildFigure(avatarImg, figureBox().size, stream, tokens, dpr);
      scrambled.clear();
      drawnKey = "";
    };

    const charAt = (i: number) => stream[((i % stream.length) + stream.length) % stream.length];

    const paintCell = (k: number, glyph: string) => {
      if (!figure) return;
      const c = figure.cells[k];
      const fctx = figure.layer.getContext("2d")!;
      fctx.fillStyle = tokens.bg;
      fctx.fillRect(c.x, c.y, figure.cw + 0.5, FIGURE.line + 0.5);
      fctx.globalAlpha = Math.max(c.level, 0.5);
      fctx.fillStyle = tokens.accent;
      fctx.fillText(glyph, c.x, c.y + 1);
      fctx.globalAlpha = 1;
    };

    const draw = () => {
      ctx.fillStyle = tokens.bg;
      ctx.fillRect(0, 0, width, height);
      ctx.font = groundFont;
      ctx.textBaseline = "top";
      ctx.fillStyle = tokens.ink;
      const firstRow = Math.floor(offset / GROUND.line);
      const shift = offset - firstRow * GROUND.line;
      const rows = Math.ceil(height / GROUND.line) + 1;
      for (let r = 0; r < rows; r++) {
        const start = (firstRow + r) * cols;
        let line = "";
        for (let c = 0; c < cols; c++) line += charAt(start + c);
        ctx.fillText(line, 0, r * GROUND.line - shift);
      }
      if (!figure) return;
      const box = figureBox();
      if (box.y + box.size > 0 && box.y < height) ctx.drawImage(figure.layer, box.x, box.y, figure.size, figure.size);
    };

    // A few dark cells flicker to a random glyph for a few frames, then settle back to code.
    const scramble = () => {
      if (!figure) return;
      for (const [k, left] of scrambled) {
        if (left <= 1) { scrambled.delete(k); paintCell(k, figure.cells[k].base); }
        else scrambled.set(k, left - 1);
      }
      const n = Math.ceil(figure.cells.length * 0.004);
      for (let i = 0; i < n; i++) {
        const k = Math.floor(Math.random() * figure.cells.length);
        if (figure.cells[k].level < 0.6 || scrambled.has(k)) continue;
        scrambled.set(k, 2 + Math.floor(Math.random() * 6));
        paintCell(k, SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]);
      }
    };

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (t - last < 1000 / FPS) return;
      const dt = last ? Math.min(t - last, 100) : 0;
      last = t;
      const heroInView = window.scrollY < heroHeight();
      if (!pausedRef.current && heroInView) {
        offset += (SPEED_PX_PER_S * dt) / 1000;
        scramble();
      }
      const key = `${Math.round(offset * 4)}|${window.scrollY}|${scrambled.size}|${figure ? 1 : 0}`;
      if (key !== drawnKey || (heroInView && !pausedRef.current)) {
        drawnKey = key;
        draw();
      }
    };

    const img = new Image();
    img.src = "/media/avatar.png";
    img.onload = () => {
      avatarImg = img;
      resize();
      draw();
    };

    resize();
    draw();
    raf = requestAnimationFrame(tick);

    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        draw();
      }, 120);
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const toggle = () => {
    setPaused((p) => {
      try {
        localStorage.setItem("ground-paused", p ? "0" : "1");
      } catch {
        /* storage unavailable: the choice lasts this visit */
      }
      return !p;
    });
  };

  return (
    <>
      <canvas ref={canvasRef} className="ground" aria-hidden="true" />
      {!reduced && (
        <button type="button" className="motion-toggle" onClick={toggle} aria-pressed={paused}>
          {paused ? "Play motion" : "Pause motion"}
        </button>
      )}
    </>
  );
}
