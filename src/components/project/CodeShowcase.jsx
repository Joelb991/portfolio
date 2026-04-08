
import { useState } from "react";
import { accent, palette } from "@/styles/palette";

/* ─── syntax highlighting via tokenization ─── */

const COLORS = {
  keyword:  "#c678dd",
  string:   "#98c379",
  comment:  "#5c6370",
  number:   "#d19a66",
  func:     "#61afef",
  operator: "#56b6c2",
  plain:    `${palette.ashGrey}dd`,
};

const PY_KW = new Set([
  "import","from","as","def","class","return","if","elif","else","for",
  "while","in","not","and","or","is","None","True","False","try","except",
  "raise","with","yield","lambda","pass","break","continue","global",
  "nonlocal","assert","del","print",
]);

const R_KW = new Set([
  "library","require","function","if","else","for","while","in","return",
  "NULL","TRUE","FALSE","NA","rm","list","c","merge","aggregate","summary",
  "head","names","table","colnames","print","source","load","save","par",
  "hist","plot","legend","dev","data.frame",
]);

/**
 * Tokenizes a single line of code into spans.
 * Returns an array of { text, color } objects.
 * This avoids dangerouslySetInnerHTML entirely.
 */
function tokenizeLine(line, language) {
  const keywords = language === "r" ? R_KW : PY_KW;
  const tokens = [];
  let i = 0;

  // Find comment start (respecting strings)
  let commentStart = -1;
  {
    let inStr = false, strCh = null;
    for (let j = 0; j < line.length; j++) {
      if (inStr) {
        if (line[j] === strCh && line[j - 1] !== "\\") inStr = false;
      } else {
        if (line[j] === '"' || line[j] === "'") { inStr = true; strCh = line[j]; }
        else if (line[j] === "#") { commentStart = j; break; }
      }
    }
  }

  const codePart = commentStart >= 0 ? line.slice(0, commentStart) : line;
  const commentPart = commentStart >= 0 ? line.slice(commentStart) : "";

  // Tokenize the code portion
  let pos = 0;
  while (pos < codePart.length) {
    const ch = codePart[pos];

    // Whitespace
    if (ch === " " || ch === "\t") {
      let end = pos;
      while (end < codePart.length && (codePart[end] === " " || codePart[end] === "\t")) end++;
      tokens.push({ text: codePart.slice(pos, end), color: null });
      pos = end;
      continue;
    }

    // Strings
    if (ch === '"' || ch === "'") {
      let end = pos + 1;
      while (end < codePart.length) {
        if (codePart[end] === ch && codePart[end - 1] !== "\\") { end++; break; }
        end++;
      }
      tokens.push({ text: codePart.slice(pos, end), color: COLORS.string });
      pos = end;
      continue;
    }

    // Numbers
    if (/\d/.test(ch) && (pos === 0 || !/[a-zA-Z_]/.test(codePart[pos - 1]))) {
      let end = pos;
      while (end < codePart.length && /[\d.]/.test(codePart[end])) end++;
      tokens.push({ text: codePart.slice(pos, end), color: COLORS.number });
      pos = end;
      continue;
    }

    // Words (identifiers / keywords)
    if (/[a-zA-Z_]/.test(ch)) {
      let end = pos;
      while (end < codePart.length && /[a-zA-Z0-9_.]/.test(codePart[end])) end++;
      const word = codePart.slice(pos, end);

      // Check if it's a function call (followed by parenthesis)
      let lookAhead = end;
      while (lookAhead < codePart.length && codePart[lookAhead] === " ") lookAhead++;
      const isFunc = lookAhead < codePart.length && codePart[lookAhead] === "(";

      if (keywords.has(word)) {
        tokens.push({ text: word, color: COLORS.keyword });
      } else if (isFunc) {
        tokens.push({ text: word, color: COLORS.func });
      } else {
        tokens.push({ text: word, color: null });
      }
      pos = end;
      continue;
    }

    // Operators
    if ("<>=!+-*/%&|^~".includes(ch)) {
      let end = pos + 1;
      // Handle two-char operators: <=, >=, ==, !=, <-, ->, ::
      if (end < codePart.length) {
        const two = ch + codePart[end];
        if (["<=",">=","==","!=","<-","->","::","**","//","+=","-=","*="].includes(two)) end++;
      }
      tokens.push({ text: codePart.slice(pos, end), color: COLORS.operator });
      pos = end;
      continue;
    }

    // Everything else (parens, brackets, commas, dots, etc.)
    tokens.push({ text: ch, color: null });
    pos++;
  }

  // Add comment
  if (commentPart) {
    tokens.push({ text: commentPart, color: COLORS.comment, italic: true });
  }

  return tokens;
}

/** Renders a single line as React spans */
function HighlightedLine({ line, language }) {
  const tokens = tokenizeLine(line, language);
  if (tokens.length === 0) return "\u00A0";
  return tokens.map((t, i) => (
    <span key={i} style={{
      color: t.color || COLORS.plain,
      fontStyle: t.italic ? "italic" : "normal",
    }}>
      {t.text}
    </span>
  ));
}

/* ─── file tab component ─── */
function FileTab({ file, active, onClick }) {
  const langColors = { python: "#3776AB", r: "#276DC3", sql: "#e38c00", javascript: "#f7df1e" };
  const c = langColors[file.language] || accent;
  return (
    <button onClick={onClick} style={{
      padding: "8px 18px",
      background: active ? palette.darkerBg : "transparent",
      border: "none",
      borderBottom: active ? `2px solid ${c}` : "2px solid transparent",
      color: active ? "#fff" : `${palette.ashGrey}66`,
      fontSize: 12,
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "'SF Mono', 'Fira Code', monospace",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      gap: 6,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: active ? 1 : 0.4 }} />
      {file.filename}
    </button>
  );
}

/* ─── main component ─── */
export default function CodeShowcase({ files, githubUrl }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (!files || files.length === 0) return null;
  const activeFile = files[activeIdx];
  const lines = activeFile.code.split("\n");
  const PREVIEW_LINES = 25;
  const showExpand = lines.length > PREVIEW_LINES;
  const displayLines = expanded ? lines : lines.slice(0, PREVIEW_LINES);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${accent}12`, background: palette.darkerBg }}>
      {/* tabs bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: `${accent}06`, borderBottom: `1px solid ${accent}10`, overflowX: "auto" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {files.map((f, i) => (
            <FileTab key={i} file={f} active={i === activeIdx} onClick={() => { setActiveIdx(i); setExpanded(false); }} />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 12px", flexShrink: 0 }}>
          {activeFile.language && (
            <span style={{ color: `${accent}66`, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>{activeFile.language}</span>
          )}
          <button onClick={handleCopy} style={{
            padding: "4px 10px", borderRadius: 6, border: `1px solid ${accent}20`, background: "transparent",
            color: copied ? "#2ecc71" : `${palette.ashGrey}66`, fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                Copied
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* code body */}
      <div style={{ overflowX: "auto", position: "relative" }}>
        <pre style={{ margin: 0, padding: 0, display: "flex" }}>
          {/* line numbers gutter */}
          <div style={{ padding: "16px 0", borderRight: `1px solid ${accent}10`, flexShrink: 0, userSelect: "none", textAlign: "right" }}>
            {displayLines.map((_, i) => (
              <div key={i} style={{ padding: "0 12px 0 16px", fontSize: 12, lineHeight: "22px", color: `${palette.ashGrey}30`, fontFamily: "'SF Mono', 'Fira Code', monospace" }}>
                {i + 1}
              </div>
            ))}
          </div>
          {/* code content */}
          <code style={{ display: "block", padding: "16px 20px", fontSize: 13, lineHeight: "22px", fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace", color: COLORS.plain, flex: 1, whiteSpace: "pre" }}>
            {displayLines.map((line, i) => (
              <div key={i} style={{ minHeight: "22px" }}>
                <HighlightedLine line={line} language={activeFile.language} />
              </div>
            ))}
          </code>
        </pre>
        {/* fade overlay when collapsed */}
        {showExpand && !expanded && (
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: `linear-gradient(transparent, ${palette.darkerBg})`, pointerEvents: "none" }} />
        )}
      </div>

      {/* expand / collapse + github link */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${accent}10`, padding: "0 4px" }}>
        <div>
          {showExpand && (
            <button onClick={() => setExpanded(!expanded)} style={{
              padding: "10px 16px", background: "transparent", border: "none",
              color: accent, fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>
              {expanded ? "Collapse" : `Show all ${lines.length} lines`}
            </button>
          )}
        </div>
        {githubUrl && (
          <a href={githubUrl} target="_blank" rel="noreferrer" style={{
            display: "flex", alignItems: "center", gap: 6, padding: "10px 16px",
            color: `${palette.ashGrey}66`, fontSize: 12, fontWeight: 600, textDecoration: "none", transition: "color 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = accent}
            onMouseLeave={e => e.currentTarget.style.color = `${palette.ashGrey}66`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85.004 1.71.115 2.51.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.16.59.67.5A10.003 10.003 0 0022 12c0-5.523-4.477-10-10-10z" /></svg>
            View full code on GitHub
          </a>
        )}
      </div>
    </div>
  );
}
