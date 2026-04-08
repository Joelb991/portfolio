
import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { accent, palette } from "@/styles/palette";
import { ALL_PROJECTS, FEATURED_PROJECT } from "@/data/projects";
import FadeIn from "@/components/ui/FadeIn";
import Tag from "@/components/ui/Tag";
import GitHubIcon from "@/components/icons/GitHubIcon";
import ExternalIcon from "@/components/icons/ExternalIcon";
import CodeShowcase from "@/components/project/CodeShowcase";
import DataPreview from "@/components/project/DataPreview";

/* ─── tiny icons ─── */
function ArrowLeftIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function DownloadIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function FileIcon({ type, size = 18 }) {
  const colors = { pdf: "#e74c3c", pptx: "#e67e22", xlsx: "#27ae60", csv: "#3498db", docx: "#2980b9", r: "#276DC3", py: "#3776AB" };
  const labels = { pdf: "PDF", pptx: "PPT", xlsx: "XLS", csv: "CSV", docx: "DOC", r: "R", py: "PY" };
  const c = colors[type] || accent;
  return (
    <div style={{ width: size + 12, height: size + 16, borderRadius: 4, background: `${c}22`, border: `1px solid ${c}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontSize: 9, fontWeight: 800, color: c, letterSpacing: "0.5px" }}>{labels[type] || "FILE"}</span>
    </div>
  );
}

/* ─── section renderers ─── */

function HighlightsSection({ section }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {section.items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <span style={{ color: accent, fontSize: 16, lineHeight: "24px", flexShrink: 0 }}>{"\u25B8"}</span>
          <span style={{ color: palette.ashGrey, fontSize: 14, lineHeight: "24px" }}>{item}</span>
        </div>
      ))}
    </div>
  );
}

function TextSection({ section }) {
  return (
    <p style={{ color: `${palette.ashGrey}cc`, fontSize: 14, lineHeight: 1.8, margin: 0, textAlign: "justify" }}>
      {section.content}
    </p>
  );
}

/* ─── KaTeX math renderer ─── */
function KaTeX({ math, display = false }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    try {
      katex.render(math, ref.current, {
        displayMode: display,
        throwOnError: false,
      });
    } catch (e) {
      ref.current.textContent = math;
    }
  }, [math, display]);
  return <span ref={ref} style={display ? { display: "block" } : undefined} />;
}

function MathSection({ section }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {section.blocks.map((block, i) => {
        if (block.type === "text") {
          return (
            <p key={i} style={{ color: `${palette.ashGrey}cc`, fontSize: 14, lineHeight: 1.8, margin: 0 }}>
              {block.content}
            </p>
          );
        }
        if (block.type === "heading") {
          return (
            <h4 key={i} style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: "8px 0 0", letterSpacing: "0.3px" }}>
              {block.content}
            </h4>
          );
        }
        if (block.type === "equation") {
          return (
            <div key={i} style={{ padding: "16px 20px", borderRadius: 10, background: palette.darkerBg, border: `1px solid ${accent}0a`, overflowX: "auto" }}>
              {block.label && (
                <p style={{ color: `${accent}99`, fontSize: 11, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 8px" }}>
                  {block.label}
                </p>
              )}
              <div style={{ fontSize: 16, color: "#fff" }}>
                <KaTeX math={block.tex} display />
              </div>
            </div>
          );
        }
        if (block.type === "constraints") {
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {block.items.map((c, j) => (
                <div key={j} style={{ padding: "14px 18px", borderRadius: 10, background: palette.darkerBg, border: `1px solid ${accent}0a`, display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ color: accent, fontSize: 12, fontWeight: 700, fontFamily: "monospace", flexShrink: 0, minWidth: 18 }}>{j + 1}.</span>
                    <span style={{ color: `${palette.ashGrey}cc`, fontSize: 13 }}>{c.description}</span>
                  </div>
                  <div style={{ paddingLeft: 28, fontSize: 15, color: "#fff", overflowX: "auto" }}>
                    <KaTeX math={c.tex} display />
                  </div>
                </div>
              ))}
            </div>
          );
        }
        if (block.type === "definitions") {
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8 }}>
              {block.items.map((d, j) => (
                <div key={j} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8, background: palette.darkerBg, border: `1px solid ${accent}0a` }}>
                  <span style={{ fontSize: 14, color: "#fff", flexShrink: 0 }}>
                    <KaTeX math={d.symbol} />
                  </span>
                  <span style={{ color: `${palette.ashGrey}99`, fontSize: 13 }}>{d.desc}</span>
                </div>
              ))}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

function ImagesSection({ section }) {
  const [selected, setSelected] = useState(null);
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {section.items.map((img, i) => (
          <div key={i} onClick={() => setSelected(i)} style={{ cursor: "pointer", borderRadius: 10, overflow: "hidden", background: palette.darkerBg, border: `1px solid ${accent}0a`, transition: "all 0.3s" }}>
            <img
              src={img.src}
              alt={img.caption}
              style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
            {img.caption && (
              <p style={{ margin: 0, padding: "10px 14px", color: `${palette.ashGrey}99`, fontSize: 12, fontWeight: 500 }}>{img.caption}</p>
            )}
          </div>
        ))}
      </div>

      {/* lightbox */}
      {selected !== null && (
        <div
          onClick={() => setSelected(null)}
          style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: 40, cursor: "zoom-out" }}
        >
          <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "85vh" }}>
            <img
              src={section.items[selected].src}
              alt={section.items[selected].caption}
              style={{ maxWidth: "100%", maxHeight: "85vh", borderRadius: 8, objectFit: "contain" }}
            />
            {section.items[selected].caption && (
              <p style={{ textAlign: "center", color: "#fff", fontSize: 14, marginTop: 12, opacity: 0.8 }}>{section.items[selected].caption}</p>
            )}
            {selected > 0 && (
              <button onClick={(e) => { e.stopPropagation(); setSelected(selected - 1); }}
                style={{ position: "absolute", left: -48, top: "50%", transform: "translateY(-50%)", background: `${accent}33`, border: "none", color: "#fff", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                {"\u2039"}
              </button>
            )}
            {selected < section.items.length - 1 && (
              <button onClick={(e) => { e.stopPropagation(); setSelected(selected + 1); }}
                style={{ position: "absolute", right: -48, top: "50%", transform: "translateY(-50%)", background: `${accent}33`, border: "none", color: "#fff", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                {"\u203A"}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function CodeSection({ section }) {
  return <CodeShowcase files={section.files} githubUrl={section.githubUrl} />;
}

function DataSection({ section }) {
  return (
    <DataPreview
      dataUrl={section.dataUrl}
      sources={section.sources}
      totalRows={section.totalRows}
      title={section.title}
    />
  );
}

function FilesSection({ section }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
      {section.items.map((file, i) => (
        <a
          key={i}
          href={file.url}
          target="_blank"
          rel="noreferrer"
          style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 10, background: palette.darkerBg, border: `1px solid ${accent}0a`, textDecoration: "none", transition: "all 0.3s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${accent}33`; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = `${accent}0a`; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <FileIcon type={file.type} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, color: "#fff", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{file.name}</p>
            <p style={{ margin: "2px 0 0", color: `${palette.ashGrey}66`, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px" }}>{file.type}</p>
          </div>
          <DownloadIcon />
        </a>
      ))}
    </div>
  );
}

/* ─── section router ─── */
function DetailSection({ section, index }) {
  const renderers = {
    highlights: HighlightsSection,
    text: TextSection,
    math: MathSection,
    images: ImagesSection,
    code: CodeSection,
    data: DataSection,
    files: FilesSection,
  };
  const Renderer = renderers[section.type];
  if (!Renderer) return null;

  return (
    <FadeIn delay={index * 0.06}>
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 3, height: 18, background: accent, borderRadius: 2, flexShrink: 0 }} />
          {section.title}
        </h3>
        <Renderer section={section} />
      </div>
    </FadeIn>
  );
}

/* ─── main page ─── */
export default function ProjectDetail() {
  const { slug } = useParams();
  const allProjects = [FEATURED_PROJECT, ...ALL_PROJECTS];
  const project = allProjects.find(p => p.slug === slug);

  if (!project) {
    return (
      <div style={{ paddingTop: 120, minHeight: "100vh", background: palette.jetBlack, textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 700 }}>Project not found</h1>
        <p style={{ color: palette.ashGrey, margin: "16px 0 32px" }}>The project you are looking for does not exist.</p>
        <Link to="/projects" style={{ color: accent, textDecoration: "none", fontWeight: 600 }}>{"\u2190"} Back to Projects</Link>
      </div>
    );
  }

  const d = project.detail;

  return (
    <div style={{ paddingTop: 60, minHeight: "100vh", background: palette.jetBlack }}>
      {/* hero */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${palette.darkerBg} 0%, ${accent}12 50%, ${palette.jetBlack} 100%)` }}>
          {project.cover && (
            <img src={project.cover} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.12 }} />
          )}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${palette.jetBlack} 0%, transparent 70%)` }} />
        </div>

        <div style={{ position: "relative", zIndex: 2, maxWidth: 860, margin: "0 auto", padding: "80px 48px 60px" }}>
          <FadeIn>
            <Link to="/projects" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: `${palette.ashGrey}88`, fontSize: 13, fontWeight: 500, textDecoration: "none", marginBottom: 28, transition: "color 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.color = accent}
              onMouseLeave={e => e.currentTarget.style.color = `${palette.ashGrey}88`}
            >
              <ArrowLeftIcon size={14} /> Back to Projects
            </Link>

            {d.subtitle && (
              <p style={{ color: `${accent}99`, fontSize: 12, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10 }}>{d.subtitle}</p>
            )}
            <h1 style={{ color: "#fff", fontSize: 40, fontWeight: 800, margin: "0 0 16px", letterSpacing: "-1px", lineHeight: 1.15 }}>{project.title}</h1>
            <p style={{ color: `${palette.ashGrey}bb`, fontSize: 15, lineHeight: 1.75, marginBottom: 24, maxWidth: 620, textAlign: "justify" }}>{d.overview}</p>

            {/* tags */}
            <div style={{ marginBottom: 24 }}>{project.tags.map(t => <Tag key={t}>{t}</Tag>)}</div>

            {/* meta pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
              {[
                d.context && { label: "Context", value: d.context },
                d.program && { label: "Program", value: d.program },
                d.course && { label: "Course", value: d.course },
                d.duration && { label: "Duration", value: d.duration },
                d.contributors && d.contributors.length > 0 && { label: "Contributors", value: d.contributors.join(", ") },
              ].filter(Boolean).map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 8, background: `${accent}0a`, border: `1px solid ${accent}12` }}>
                  <span style={{ color: `${palette.ashGrey}55`, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{m.label}</span>
                  <span style={{ color: palette.ashGrey, fontSize: 13 }}>{m.value}</span>
                </div>
              ))}
            </div>

            {/* action buttons */}
            {project.links && project.links.length > 0 && (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {project.links.map((l, i) => (
                  <a key={i} href={l.url} target="_blank" rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 50, fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "all 0.3s", border: `1.5px solid ${palette.ashGrey}44`, color: palette.ashGrey }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = `${accent}18`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = `${palette.ashGrey}44`; e.currentTarget.style.color = palette.ashGrey; e.currentTarget.style.background = "transparent"; }}
                  >
                    {l.type === "github" ? <GitHubIcon size={14} /> : <ExternalIcon size={13} />}
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      {/* content sections */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "20px 48px 80px" }}>
        {d.sections.map((s, i) => (
          <DetailSection key={i} section={s} index={i} />
        ))}
      </section>

      {/* bottom nav */}
      <section style={{ borderTop: `1px solid ${accent}12`, padding: "40px 48px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", justifyContent: "center" }}>
          <Link to="/projects"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, color: palette.ashGrey, fontSize: 14, fontWeight: 600, textDecoration: "none", padding: "10px 24px", borderRadius: 50, border: `1px solid ${palette.ashGrey}33`, transition: "all 0.3s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${palette.ashGrey}33`; e.currentTarget.style.color = palette.ashGrey; }}
          >
            <ArrowLeftIcon size={14} /> View All Projects
          </Link>
        </div>
      </section>
    </div>
  );
}
