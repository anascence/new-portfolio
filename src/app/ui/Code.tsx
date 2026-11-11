import { Fragment } from "react";

// A deliberately small highlighter for the excerpts on this page (TS, Go, PHP): comments, strings,
// keywords, numbers and call names. Anything it doesn't recognise stays plain text.
const KEYWORDS = new Set(
  "const let var function return if else try catch await async export default import from type interface func package new true false nil null isset".split(" "),
);
const TOKEN = /((?<![:\w])\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\$?[A-Za-z_][\w]*)(?=\s*\()|(\$?[A-Za-z_][\w]*)|(\b\d+\b)/g;

export function highlight(line: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of line.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) out.push(line.slice(last, i));
    const [text, comment, str, call, word, num] = m;
    const cls = comment ? "tk-c" : str ? "tk-s" : call ? (KEYWORDS.has(call) ? "tk-k" : "tk-f") : word ? (KEYWORDS.has(word) ? "tk-k" : null) : num ? "tk-n" : null;
    out.push(cls ? <span key={i} className={cls}>{text}</span> : text);
    last = i + text.length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

export function Code({ lines, start = 1, numbered = true }: { lines: string[]; start?: number; numbered?: boolean }) {
  return (
    <pre className="code">
      <code>
        {lines.map((line, i) => (
          <Fragment key={i}>
            {numbered && <span className="code__no">{start + i}</span>}
            {highlight(line)}
            {"\n"}
          </Fragment>
        ))}
      </code>
    </pre>
  );
}
